import { HttpMethod } from '@dvcol/common-utils/http';

import type {
  SimklAuthenticationAuthorizeRequest,
  SimklAuthenticationCode,
  SimklAuthenticationCodeStatusRequest,
  SimklAuthenticationCodeStatusResponse,
  SimklAuthenticationPinCodeRequest,
  SimklAuthenticationToken,
  SimklAuthenticationTokenRequest,
} from '~/models/simkl-authentication.model';

import { Config } from '~/config';

import { SimklClientEndpoint } from '~/models/simkl-client.model';

/**
 * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/authentication-oauth-2.0/authorize-application}
 */
export const authentication = {
  /**
   * Redirect a user to this URL.
   *
   * There the user will grant permissions for you app and if everything is fine you'll get a code which you can exchange for access_token.
   * Once you have an access token you can use it to make calls on behalf of a user.
   *
   * * Note: You should use the https://simkl.com domain when calling this endpoint and not the API URL.
   *
   * @see [authorize]{@link https://simkl.docs.apiary.io/#reference/authentication-oauth-2.0/authorize}
   */
  authorize: new SimklClientEndpoint<SimklAuthenticationAuthorizeRequest, unknown, false>({
    method: HttpMethod.GET,
    url: '/oauth/authorize',
    seed: {
      response_type: 'code',
    },
    init: {
      redirect: 'manual',
      credentials: 'omit',
    },
    opts: {
      endpoint: Config.Website,
      cache: false,
      parameters: {
        query: {
          response_type: true,
          redirect_uri: true,
          client_id: true,
          state: false,
        },
      },
    },
  }),
  /**
   *
   * The redirect to your application in the step above will include a code parameter which you can exchange for an access_token using this method.
   * Save the access_token somewhere safe.
   *
   * From that moment your app can authenticate the user by sending the Authorization header
   *
   * Note:
   * - access_token do not have expiration date (Never expire).
   * - access_token can be deleted by user when revoking app access rights in [Connected Apps settings]{@link https://simkl.com/settings/connected-apps/}.
   *
   * @see [token]{@link https://simkl.docs.apiary.io/#reference/authentication-oauth-2.0/token}
   */
  token: new SimklClientEndpoint<SimklAuthenticationTokenRequest, SimklAuthenticationToken, false>({
    method: HttpMethod.POST,
    url: '/oauth/token',
    seed: {
      grant_type: 'authorization_code',
    },
    body: {
      grant_type: true,
      code: true,
      client_id: true,
      client_secret: true,
      redirect_uri: true,
    },
    opts: {
      cache: false,
    },
  }),
  /**
   * This flow is designed for devices that have limited input capabilities, such as media center plugins, game consoles, smart watches, smart TVs, command line scripts, and system services, etc.
   * Your app displays an alphanumeric code (typically 5 characters) to the user.
   * They are then instructed to visit the verification URL on their computer or mobile device.
   * After entering the code, the user will be prompted to grant permission for your app.
   * After your app gets permissions, the device receives an access_token and works like standard OAuth from that point on.
   *
   * You should do the following step to authorize user's device:
   * - Request a device code.
   * - Display user_code and instruct the user to visit the verification_url.
   * - Begin polling Simkl's authorization server.
   * - User enters user_code at the verification_url on their computer or mobile device.
   * - Simkl returns access_token to the device where the polling is in progress.
   * - Your app will be polling to see if the user successfully authorizes your app.
   *
   * Note:
   * - Use expires_in to stop polling after that many seconds, and gracefully instruct the user to restart the process.
   * - It is important to poll at the correct interval and also stop polling when expired.
   *
   * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/authentication-pin}
   */
  pin: {
    /**
     * Request a device code.
     *
     * In response you'll get user_code and verification_url (in most cases https://simkl.com/pin/) which should be displayed to the user.
     *
     * @see [pin-code]{@link https://simkl.docs.apiary.io/#reference/authentication-pin/request-a-device-code/get-code}
     */
    code: new SimklClientEndpoint<SimklAuthenticationPinCodeRequest, SimklAuthenticationCode, false>({
      method: HttpMethod.GET,
      url: '/oauth/pin',
      opts: {
        cache: false,
        parameters: {
          query: {
            client_id: true,
            redirect: false,
          },
        },
      },
    }),
    /**
     * Polling Simkl's authorization server.
     *
     * Application can poll this url to get USER_CODE status or ACCESS_TOKEN.
     * Returned interval in step 1 response specifies the minimum amount of time(seconds), that your app should wait between polling requests.
     *
     * @see [pin-status]{@link https://simkl.docs.apiary.io/#reference/authentication-pin/get-code-status/check-user_code}
     */
    status: new SimklClientEndpoint<SimklAuthenticationCodeStatusRequest, SimklAuthenticationCodeStatusResponse, false>({
      method: HttpMethod.GET,
      url: '/oauth/pin',
      opts: {
        cache: false,
        parameters: {
          query: {
            client_id: true,
            user_code: true,
          },
        },
      },
    }),
  },
};
