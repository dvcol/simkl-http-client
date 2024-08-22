import { BaseHeaderContentType } from '@dvcol/base-http-client';
import { BaseApiHeaders } from '@dvcol/base-http-client/utils/http';
import { HttpMethod } from '@dvcol/common-utils/http';
import { CancellableFetch } from '@dvcol/common-utils/http/fetch';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { simklClientSettingsMock } from '../mocks/settings.mock';

import { SimklApiAuthType, SimklApiError, SimklApiExtended } from '../models';

import { BaseSimklClient, parseResponse } from './base-simkl-client';

import type { SimklApiParamsExtended, SimklApiParamsPagination } from '../models';
import type { BaseBody, BaseInit } from '@dvcol/base-http-client';

import type { Updater } from '@dvcol/common-utils/common';

import type { SimklApiParams, SimklApiTemplate, SimklClientAuthentication } from '~/models/simkl-client.model';

import { SimklApiHeader } from '~/models/simkl-client.model';

class TestableSimklClient extends BaseSimklClient {
  publicUpdateAuth(auth: Updater<SimklClientAuthentication>) {
    return this.updateAuth(auth);
  }

  publicCall<P extends SimklApiParams>(template: SimklApiTemplate<P>, params: P = {} as P, init?: BaseInit) {
    return this._call<P>(template, params, init);
  }

  publicParseBody<T extends SimklApiParams = SimklApiParams>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return this._parseBody(template, params);
  }

  publicParse<T extends SimklApiParams>(template: SimklApiTemplate<T>, params: T) {
    return this._parseUrl(template, params).toString();
  }
}

describe('base-simkl-client.ts', () => {
  const client = new TestableSimklClient(simklClientSettingsMock);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect.assertions(2);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  type Params = {
    requiredQuery: string;
    optionalQuery?: string;
    requiredPath: string;
    optionalPath?: string;
    requiredBody: string;
    optionalBody?: string;
  } & SimklApiParamsExtended<typeof SimklApiExtended.Full> &
    SimklApiParamsPagination;

  // Mock data for testing
  const mockParams: SimklApiParams<Params> = {
    requiredQuery: 'requiredQuery',
    requiredPath: 'requiredPath',
    requiredBody: 'requiredBody',
    page: 1,
    limit: 10,
    extended: SimklApiExtended.Full,
  };

  // Mock SimklApiTemplate for testing
  const mockTemplate: SimklApiTemplate<Params> = {
    url: '/movies/:requiredPath/:optionalPath/popular?requiredQuery=&optionalQuery=',
    method: HttpMethod.POST,
    opts: {
      parameters: {
        query: {
          requiredQuery: true,
          optionalQuery: false,
          extended: false,
          page: false,
          limit: false,
        },
        path: {
          requiredPath: true,
          optionalPath: false,
        },
      },
      pagination: true,
    },
    body: {
      requiredBody: true,
      optionalBody: false,
    },
  };

  describe('parseParams', () => {
    it('should construct a valid URL for Simkl API request', async () => {
      expect.assertions(1);

      const result = client.publicParse(mockTemplate, mockParams);

      expect(result).toBe(
        `${simklClientSettingsMock.endpoint}/movies/requiredPath/popular?requiredQuery=requiredQuery&extended=full&page=1&limit=10`,
      );
    });

    it('should throw an error for missing mandatory query parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredQuery: '' });
      expect(testFunction).toThrow("Missing mandatory query parameter: 'requiredQuery'");
    });

    it('should throw an error for missing mandatory path parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredPath: '' });
      expect(testFunction).toThrow("Missing mandatory path parameter: 'requiredPath'");
    });
  });

  describe('parseBody', () => {
    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const result = client.publicParseBody<SimklApiParams<Params>>(mockTemplate.body!, mockParams);
      expect(result).toBe('{"requiredBody":"requiredBody"}');
    });

    it('should parse body with payload field', () => {
      expect.assertions(1);
      const payload = [
        { id: 1, name: 'name' },
        { id: 2, name: 'name' },
      ];

      const result = client.publicParseBody<SimklApiParams<{ payload: typeof payload }>>(mockTemplate.body!, { payload });
      expect(result).toBe(JSON.stringify(payload));
    });

    it('should parse body to JSON string and throw when param is missing ', () => {
      expect.assertions(1);

      const mockBody: Record<string, unknown> = { ...mockParams, optionalBody: 'optionalBody' };
      delete mockBody.requiredBody;
      const testFunction = () => client.publicParseBody(mockTemplate.body!, mockBody);
      expect(testFunction).toThrow("Missing mandatory body parameter: 'requiredBody'");
    });
  });

  describe('parseResponse', () => {
    it('should parse an empty response', () => {
      expect.assertions(2);

      const response = new Response();
      const parsed = parseResponse(response);

      expect(parsed).toBe(response);
      expect(parsed.pagination).toBeUndefined();
    });

    it('should parse a response with pagination headers', () => {
      expect.assertions(1);

      const response = new Response();
      response.headers.set(SimklApiHeader.XPaginationItemCount, '1');
      response.headers.set(SimklApiHeader.XPaginationPageCount, '2');
      response.headers.set(SimklApiHeader.XPaginationLimit, '3');
      response.headers.set(SimklApiHeader.XPaginationPage, '4');
      const parsed = parseResponse(response);

      expect(parsed.pagination).toMatchObject({
        itemCount: 1,
        pageCount: 2,
        limit: 3,
        page: 4,
      });
    });

    it('should throw on failed fetch response', async () => {
      expect.assertions(1);

      const failedResponse = new Response('content', {
        status: 404,
        statusText: 'Not Found',
      });

      let error;
      try {
        parseResponse(failedResponse);
      } catch (err) {
        error = err;
      } finally {
        expect(error).toStrictEqual(new SimklApiError(failedResponse.statusText, failedResponse));
      }
    });

    it('should not throw on failed fetch response of type opaqueredirect', async () => {
      expect.assertions(1);

      const testFunction = () =>
        parseResponse({
          ok: false,
          status: 302,
          statusText: 'Found',
          type: 'opaqueredirect',
          headers: new Headers(),
        } as Response);
      expect(testFunction).not.toThrow();
    });
  });

  it('should make a call to the Simkl API', async () => {
    expect.assertions(4);

    const response = new Response();

    response.headers.set(SimklApiHeader.XPaginationItemCount, '1');
    response.headers.set(SimklApiHeader.XPaginationPageCount, '2');
    response.headers.set(SimklApiHeader.XPaginationLimit, '3');
    response.headers.set(SimklApiHeader.XPaginationPage, '4');

    const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

    const result = await client.publicCall(mockTemplate, mockParams);

    expect(spyFetch).toHaveBeenCalledWith(
      `${simklClientSettingsMock.endpoint}/movies/requiredPath/popular?requiredQuery=requiredQuery&extended=full&page=1&limit=10`,
      {
        body: '{"requiredBody":"requiredBody"}',
        headers: {
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
          [BaseApiHeaders.UserAgent]: simklClientSettingsMock.useragent,
          [SimklApiHeader.SimklApiKey]: simklClientSettingsMock.client_id,
        },
        method: HttpMethod.POST,
      },
    );

    expect(result).toBe(response);

    expect(result.pagination).toMatchObject({
      itemCount: 1,
      pageCount: 2,
      limit: 3,
      page: 4,
    });

    expect(spyFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if auth is missing', async () => {
    expect.assertions(1);

    const testFunction = () => client.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: SimklApiAuthType.User } }, mockParams);
    expect(testFunction).toThrow('OAuth required: access_token is missing');
  });

  it('should throw an error if auth is missing', async () => {
    expect.assertions(1);
    const clientNoAuth = new TestableSimklClient({ ...simklClientSettingsMock, client_id: undefined });

    const testFunction = () =>
      clientNoAuth.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: SimklApiAuthType.Client } }, mockParams);
    expect(testFunction).toThrow('Auth required: client_id is missing');
  });
});
