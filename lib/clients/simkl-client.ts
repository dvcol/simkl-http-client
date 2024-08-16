import { PKCECodeGenerator } from '@dvcol/common-utils/common/crypto';

import type { BaseInit } from '@dvcol/base-http-client';

import type { SimklAuthenticationCode, SimklAuthorizeQuery, SimklTokenExchangeQuery } from '~/models/simkl-authentication.model';

import type { ISimklApi, SimklClientAuthentication, SimklClientOptions } from '~/models/simkl-client.model';

import { minimalSimklApi } from '~/api/simkl-api-minimal.endpoints';

import { BaseSimklClient } from '~/clients/base-simkl-client';
import { SimklPollingResult, SimklPollingStatus } from '~/models/simkl-authentication.model';
import {
  SimklApiError,
  SimklInvalidCsrfError,
  SimklInvalidParameterError,
  SimklPollingCancelledError,
  SimklPollingExpiredError,
} from '~/models/simkl-error.model';

export type CancellablePolling = Promise<SimklClientAuthentication> & { cancel: () => void };

/**
 * MalClient is a wrapper around the MalApi to provide basic authentication and state management.
 *
 * @class SimklClient
 *
 * @extends {BaseSimklClient}
 */
export class SimklClient extends BaseSimklClient {
  protected polling: ReturnType<typeof setTimeout> | undefined;
  protected poll: SimklAuthenticationCode | undefined;

  /**
   * The url to redirect to after the user has authorized the application.
   */
  get redirectUri() {
    return this.settings.redirect_uri;
  }

  /**
   * Creates an instance of MalClient, with the necessary endpoints and settings.
   * @param settings - The settings for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(settings: SimklClientOptions, authentication: SimklClientAuthentication = {}, api: ISimklApi = minimalSimklApi) {
    super(settings, authentication, api);
  }

  protected _clearPolling() {
    // If polling already cancelled
    if (this.polling === undefined) return;
    clearInterval(this.polling);
    this.polling = undefined;
  }

  protected _clearPoll() {
    this.poll = undefined;
  }

  /**
   * Initiates the OAuth process by redirecting to the Simkl website.
   * Users will be prompted to sign in and authorize the application.
   *
   * Once redirected back to the application, the code should be exchanged for an access token.
   *
   * @param redirect - The type of redirect to use (defaults to manual).
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param request.code_challenge - The code challenge to match against the code verifier.
   * @param request.state - The optional CSRF token to verify the state.
   * @param request - Additional parameters for the authorization request.
   * @returns A promise resolving to the response from the Simkl website.
   *
   * @see [authorize]{@link https://simkl.docs.apiary.io/#reference/authentication-oauth-2.0/authorize/authorize-application}
   */
  async authorize({ redirect, redirect_uri, ...request }: SimklAuthorizeQuery = {}) {
    const state = request.state ?? (await PKCECodeGenerator.code());
    this.updateAuth(auth => ({ ...auth, state }));
    const init: BaseInit = { credentials: 'omit' };
    if (redirect) init.redirect = redirect;
    return this.authentication.authorize(
      {
        response_type: 'code',
        client_id: this.settings.client_id,
        redirect_uri: redirect_uri ?? this.settings.redirect_uri,
        ...request,
        state,
      },
      init,
    );
  }

  /**
   * Initiates the OAuth process by generating a URL to the Simkl website.
   * Users will be prompted to sign in and authorize the application.
   *
   * Once redirected back to the application, the code should be exchanged for an access token with {@link exchangeCodeForToken}.
   *
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param request - Additional parameters for the authorization request.
   * @returns A promise resolving to the response from the Simkl website.
   *
   * @see [authorize]{@link https://simkl.docs.apiary.io/#reference/authentication-oauth-2.0/authorize/authorize-application}
   */
  async resolveAuthorizeUrl({ redirect_uri, ...request }: Omit<SimklAuthorizeQuery, 'redirect'> = {}) {
    const state = request.state ?? (await PKCECodeGenerator.code());
    this.updateAuth(auth => ({ ...auth, state }));
    return this.authentication.authorize
      .resolve({
        response_type: 'code',
        client_id: this.settings.client_id,
        redirect_uri: redirect_uri ?? this.settings.redirect_uri,
        ...request,
        state,
      })
      .toString();
  }

  /**
   * Exchanges the authorization code obtained after the user has authorized the application with {@link authorize} or {@link resolveAuthorizeUrl}.
   *
   * @param  code - The authorization code obtained from the user.
   * @param code_verifier - The code verifier to match again the code challenge.
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param  state - The optional CSRF token to verify the state.
   *
   * @returns  A promise resolving to the Trakt authentication information.
   *
   * @throws Error Throws an error if the CSRF token is invalid.
   */
  async exchangeCodeForToken({ code, redirect_uri }: SimklTokenExchangeQuery, state?: string) {
    if (state && state !== this.auth.state) throw new SimklInvalidCsrfError({ state, expected: this.auth.state });

    const response = await this.authentication.token({
      code,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
      redirect_uri: redirect_uri ?? this.settings.redirect_uri,
    });

    const token = await response.json();

    this.updateAuth({ created: Date.now(), ...token, state });

    return this.auth;
  }

  /**
   * Gets the device code for initiating device authentication.
   *
   * The code should then be used in conjunction with the {@link pollWithDeviceCode} method to finish authentication.
   *
   * @returns A promise resolving to the device authentication information.
   */
  async getDeviceCode(redirect?: string) {
    try {
      const response = await this.authentication.pin.code({ client_id: this.settings.client_id, redirect });
      this.poll = await response.json();
      return this.poll;
    } catch (error) {
      this._clearPoll();
      throw error;
    }
  }

  /**
   * Polls the device authentication endpoint to complete the authentication.
   * If the timeout is reached, the polling is cancelled and an error is thrown.
   * If the authentication is successful, the polling is cancelled and the authentication information is returned.
   *
   * @param poll - The device authentication information.
   * @param timeout - The timeout in milliseconds.
   *
   * @returns A promise resolving to the authentication information if successful
   */
  protected async _devicePolling(poll: SimklAuthenticationCode = this.poll, timeout: number): Promise<SimklClientAuthentication | null> {
    // If polling already cancelled
    if (this.polling === undefined) return;
    if (!poll?.user_code) throw new SimklInvalidParameterError('No user code found.');
    if (!this.settings.client_id) throw new SimklInvalidParameterError('No client ID found.');
    if (timeout <= Date.now()) throw new SimklPollingExpiredError();

    const response = await this.authentication.pin.status({
      client_id: this.settings.client_id,
      user_code: poll.user_code,
    });

    const auth = await response.json();

    if (auth.result === SimklPollingResult.OK) {
      this.updateAuth(_auth => ({ ..._auth, created: Date.now(), access_token: auth.access_token }));
      return this.auth;
    }

    if (auth.message === SimklPollingStatus.Pending) {
      console.info('Polling in progress...');
      return null;
    }
    throw new SimklApiError(auth.message);
  }

  /**
   * Initiates polling with the code obtained by {@link getDeviceCode} to complete device authentication.
   *
   * @param  poll - The device authentication information.
   *
   * @returns  A promise resolving to the completed authentication information or `undefined`.
   */
  pollWithDeviceCode(poll: SimklAuthenticationCode = this.poll): CancellablePolling {
    if (!poll?.user_code) throw new SimklInvalidParameterError('No device code found.');
    if (this.polling) {
      this._clearPolling();
      console.warn('Polling already in progress, cancelling previous one...');
    }

    const timeout = Date.now() + poll.expires_in * 1000;

    let reject: (reason?: any) => void;
    const promise$ = new Promise<SimklClientAuthentication>((_resolve, _reject) => {
      reject = _reject;
      const pollDevice = async () => {
        try {
          const body = await this._devicePolling(poll, timeout);
          if (body) return _resolve(body);
        } catch (err) {
          _reject(err);
        } finally {
          this._clearPolling();
          this._clearPoll();
        }
      };
      this.polling = setInterval(pollDevice, poll.interval * 1000);
    }) as CancellablePolling;
    // if cancelled clear polling interval
    promise$.cancel = () => {
      this._clearPolling();
      this._clearPoll();
      console.warn('Polling cancelled');
      reject(new SimklPollingCancelledError());
    };
    return promise$;
  }

  /**
   * Imports the provided authentication information into the client.
   * If the access token is expired, it attempts to refresh it.
   *
   * @param auth - The authentication information to import.
   *
   * @returns A promise resolving to the imported authentication information.
   */
  async importAuthentication(auth: SimklClientAuthentication = {}): Promise<SimklClientAuthentication> {
    this.updateAuth(auth);
    return this.auth;
  }
}
