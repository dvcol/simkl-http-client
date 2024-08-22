import { BaseHeaderContentType } from '@dvcol/base-http-client';
import { BaseApiHeaders } from '@dvcol/base-http-client/utils/http';
import { hasOwnProperty } from '@dvcol/base-http-client/utils/test';

import { HttpMethod } from '@dvcol/common-utils/http';
import { CancellableFetch } from '@dvcol/common-utils/http/fetch';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { minimalSimklApi } from '../api/simkl-api-minimal.endpoints';
import { simklApi } from '../api/simkl-api.endpoints';

import { Config } from '../config';
import { simklClientSettingsMock } from '../mocks/settings.mock';

import {
  SimklApiError,
  SimklApiHeader,
  SimklInvalidCsrfError,
  SimklInvalidParameterError,
  SimklPollingCancelledError,
  SimklPollingResult,
  SimklPollingStatus,
} from '../models';

import { SimklClient } from './simkl-client';

import type { SimklAuthenticationCode, SimklAuthenticationCodeStatus, SimklAuthenticationCodeToken, SimklAuthenticationToken } from '../models';

import type { CacheStore } from '@dvcol/common-utils';

import type { SimklApiResponse } from '~/models/simkl-client.model';

class PublicSimklClient extends SimklClient {
  public declare polling: ReturnType<typeof setTimeout> | undefined;
  public declare poll: SimklAuthenticationCode | undefined;
}

describe('simkl-client.ts', () => {
  const simklClient = new PublicSimklClient(simklClientSettingsMock, {}, simklApi);
  const fetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(new Response());

  const payload = {
    headers: {
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [BaseApiHeaders.UserAgent]: simklClientSettingsMock.useragent,
      [SimklApiHeader.SimklApiKey]: simklClientSettingsMock.client_id,
    },
    method: HttpMethod.GET,
  };

  const authentication: SimklAuthenticationToken = {
    access_token: 'access_token',
    token_type: 'bearer',
    scope: 'public',
  };

  afterEach(async () => {
    await simklClient.importAuthentication({});
    await simklClient.clearCache();
    simklClient.poll = undefined;
    simklClient.polling = undefined;

    vi.clearAllMocks();
  });

  describe('simklClient', () => {
    it('should have every endpoint', () => {
      expect.hasAssertions();

      hasOwnProperty(simklApi, simklClient);
    });

    it('should have only minimal endpoint', () => {
      expect.hasAssertions();

      const minimalClient = new SimklClient(simklClientSettingsMock, {});
      hasOwnProperty(minimalSimklApi, minimalClient);
    });

    it('should query show method', async () => {
      expect.assertions(1);

      await simklClient.show.id({ id: 1234 });

      expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
    });

    describe('cache', () => {
      it('should not cache calls', async () => {
        expect.assertions(2);

        await simklClient.show.id({ id: 1234 });
        await simklClient.show.id({ id: 1234 });
        await simklClient.show.id({ id: 1234 });

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
      });

      it('should cache subsequent calls', async () => {
        expect.assertions(2);

        await simklClient.show.id.cached({ id: 1234 });
        await simklClient.show.id.cached({ id: 1234 });
        await simklClient.show.id.cached({ id: 1234 });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache cleared', async () => {
        expect.assertions(2);

        await simklClient.show.id.cached({ id: 1234 });
        await simklClient.show.id.cached({ id: 1234 });
        await simklClient.clearCache();
        await simklClient.show.id.cached({ id: 1234 });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
      });

      it('should clear cache after error', async () => {
        expect.assertions(3);

        const error = new Error('Error');
        fetch.mockRejectedValueOnce(error);

        let err: unknown;
        try {
          await simklClient.show.id.cached({ id: 1234 });
        } catch (e) {
          err = e;
        } finally {
          expect(err).toBe(error);
        }
        await simklClient.show.id.cached({ id: 1234 });
        await simklClient.show.id.cached({ id: 1234 });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache expired', async () => {
        expect.assertions(2);

        const cacheStore: CacheStore<SimklApiResponse> = new Map();
        cacheStore.retention = 15;
        const _simklClient = new SimklClient({ ...simklClientSettingsMock, cacheStore }, {}, simklApi);

        await _simklClient.show.id.cached({ id: 1234 });
        await _simklClient.show.id.cached({ id: 1234 });

        // Wait for cache to expire
        await new Promise(resolve => {
          setTimeout(resolve, 20);
        });

        await _simklClient.show.id.cached({ id: 1234 });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/tv/1234', simklClientSettingsMock.endpoint).toString(), payload);
      });
    });

    describe('oAuth', () => {
      it('should redirect to authorization url', async () => {
        expect.assertions(1);

        const state = '0e44c45dd73fb296';

        const url = new URL('/oauth/authorize', Config.Website);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', simklClientSettingsMock.redirect_uri);
        url.searchParams.append('client_id', simklClientSettingsMock.client_id);
        url.searchParams.append('state', state);

        await simklClient.authorize({ state });

        expect(fetch).toHaveBeenCalledWith(url.toString(), {
          credentials: 'omit',
          headers: {
            [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
            [BaseApiHeaders.UserAgent]: simklClientSettingsMock.useragent,
            [SimklApiHeader.SimklApiKey]: simklClientSettingsMock.client_id,
          },
          method: HttpMethod.GET,
          redirect: 'manual',
        });
      });

      it('should exchange code for token', async () => {
        expect.assertions(1);

        const code = 'redirect_code';

        fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

        await simklClient.exchangeCodeForToken({ code });

        expect(fetch).toHaveBeenCalledWith(new URL('/oauth/token', simklClientSettingsMock.endpoint).toString(), {
          ...payload,
          method: HttpMethod.POST,
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            client_id: simklClientSettingsMock.client_id,
            client_secret: simklClientSettingsMock.client_secret,
            redirect_uri: simklClientSettingsMock.redirect_uri,
          }),
        });
      });

      it('should throw error while exchanging code with invalid CSRF', async () => {
        expect.assertions(3);

        const state = '0e44c45dd73fb296';

        await simklClient.authorize({ state });

        let error: Error | undefined;
        try {
          await simklClient.exchangeCodeForToken({ code: 'redirect_code' }, 'invalid_state');
        } catch (err) {
          error = err as Error;
        } finally {
          expect(error).toBeDefined();
          expect(error).toBeInstanceOf(SimklInvalidCsrfError);
          expect(error?.message).toBe("Invalid CSRF (State): expected '0e44c45dd73fb296', but received invalid_state");
        }
      });
    });
  });

  describe('polling', () => {
    const deviceAuthentication: SimklAuthenticationCode = {
      result: SimklPollingResult.OK,
      device_code: 'device_code',
      user_code: 'user_code',
      verification_url: 'verification_url',
      expires_in: new Date().getTime() + 10000,
      interval: 0.01,
    };

    const pendingAuthentication: SimklAuthenticationCodeStatus = {
      result: SimklPollingResult.KO,
      message: SimklPollingStatus.Pending,
    };

    const successAuthentication: SimklAuthenticationCodeToken = {
      result: SimklPollingResult.OK,
      access_token: 'access_token',
    };

    it('should get device code', async () => {
      expect.assertions(2);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(deviceAuthentication)));

      await simklClient.getDeviceCode();

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/pin?client_id=my-client-id', simklClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.GET,
      });

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should store poll in memory', async () => {
      expect.assertions(4);
      vi.useFakeTimers();
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(deviceAuthentication)));

      await simklClient.getDeviceCode();

      expect(simklClient.poll).toBeDefined();

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(successAuthentication)));

      const promise = simklClient.pollWithDeviceCode();
      vi.advanceTimersByTime(simklClient.poll.interval * 1000);
      await promise;

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(simklClient.poll).toBeUndefined();
      expect(simklClient.polling).toBeUndefined();
    });

    it('should poll with device code', async () => {
      expect.assertions(4);
      vi.useFakeTimers();

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(pendingAuthentication)));
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(successAuthentication)));

      const promise = simklClient.pollWithDeviceCode(deviceAuthentication);
      vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
      vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
      await promise;

      expect(fetch).toHaveBeenCalledWith(
        new URL(`/oauth/pin/${deviceAuthentication.user_code}?client_id=my-client-id`, simklClientSettingsMock.endpoint).toString(),
        {
          ...payload,
          method: HttpMethod.GET,
        },
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(simklClient.poll).toBeUndefined();
      expect(simklClient.polling).toBeUndefined();
    });

    it('should throw if no poll in memory', async () => {
      expect.assertions(3);

      let error: Error | undefined;
      try {
        await simklClient.pollWithDeviceCode();
      } catch (err) {
        error = err;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SimklInvalidParameterError);
        expect(error?.message).toBe('No device code found.');
      }
    });

    it('should cancel polling', async () => {
      expect.assertions(6);
      vi.useFakeTimers();

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(pendingAuthentication)));

      let error: Error | undefined;
      try {
        const promise = simklClient.pollWithDeviceCode(deviceAuthentication);
        vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
        vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
        vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
        promise.cancel();
        await promise;
      } catch (err) {
        error = err;
      } finally {
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(error).toBeInstanceOf(SimklPollingCancelledError);
        expect(error?.message).toBe('Polling cancelled.');
        expect(simklClient.poll).toBeUndefined();
        expect(simklClient.polling).toBeUndefined();
      }
    });

    it('should exit on error while polling with device code', async () => {
      expect.assertions(5);
      vi.useFakeTimers();

      fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 500,
        }),
      );

      let error: SimklApiError | undefined;
      try {
        const promise = simklClient.pollWithDeviceCode(deviceAuthentication);
        vi.advanceTimersByTime(deviceAuthentication.interval * 1000);
        await promise;
      } catch (err) {
        error = err as SimklApiError;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SimklApiError);
        expect((error?.error as Response).status).toBe(500);
        expect(fetch).toHaveBeenCalledWith(
          new URL(`/oauth/pin/${deviceAuthentication.user_code}?client_id=my-client-id`, simklClientSettingsMock.endpoint).toString(),
          {
            ...payload,
            method: HttpMethod.GET,
          },
        );

        expect(fetch).toHaveBeenCalledTimes(1);
      }
    });
  });
});
