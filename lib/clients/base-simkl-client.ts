import { type BaseBody, BaseClient } from '@dvcol/base-http-client';

import { injectCorsProxyPrefix, parseBody, parseUrl } from '@dvcol/base-http-client/utils/client';
import { BaseApiHeaders, BaseHeaderContentType } from '@dvcol/base-http-client/utils/http';

import type { RecursiveRecord } from '@dvcol/common-utils/common/models';

import type { SimklApi } from '~/api/simkl-api.endpoints';

import type {
  ISimklApi,
  SimklApiParams,
  SimklApiQuery,
  SimklApiResponse,
  SimklApiTemplate,
  SimklClientAuthentication,
  SimklClientOptions,
  SimklClientSettings,
} from '~/models/simkl-client.model';

import { SimklApiAuthType, SimklApiHeader } from '~/models/simkl-client.model';

import { SimklApiError, SimklInvalidParameterError, SimklRateLimitError, SimklUnauthorizedError } from '~/models/simkl-error.model';

/**
 * Checks if the fetch response is OK and handles redirects.
 *
 * @private
 *
 * @param  response - The fetch response.
 *
 * @returns  The same response object if OK.
 *
 * @throws Throws the response if not OK.
 */
export const isResponseOk = (response: Response) => {
  if (response.type === 'opaqueredirect') return response;
  if (response.status === 401) throw new SimklUnauthorizedError(response.statusText, response);
  if (response.status === 429) throw new SimklRateLimitError(response.statusText, response);
  if (!response.ok || response.status >= 400) throw new SimklApiError(response.statusText, response);
  return response;
};

/**
 * Parses a API response to extract {@link SimklApiClientPagination} information.
 *
 * @private
 *
 * @template T - The type of the response.
 *
 * @param {Response} response - The fetch response.
 *
 * @returns {SimklApiResponse<T>} The parsed API response.
 */
export const parseResponse = <T>(response: SimklApiResponse<T>): SimklApiResponse<T> => {
  isResponseOk(response);

  if (
    response.headers.has(SimklApiHeader.XPaginationItemCount) ||
    response.headers.has(SimklApiHeader.XPaginationPageCount) ||
    response.headers.has(SimklApiHeader.XPaginationLimit) ||
    response.headers.has(SimklApiHeader.XPaginationPage)
  ) {
    response.pagination = {
      itemCount: Number(response.headers.get(SimklApiHeader.XPaginationItemCount)),
      pageCount: Number(response.headers.get(SimklApiHeader.XPaginationPageCount)),
      limit: Number(response.headers.get(SimklApiHeader.XPaginationLimit)),
      page: Number(response.headers.get(SimklApiHeader.XPaginationPage)),
    };
  }

  return response;
};

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseSimklClient extends SimklApi {}

/**
 * Represents a Mal API client with common functionality.
 *
 * @class BaseSimklClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseSimklClient extends BaseClient<SimklApiQuery, SimklApiResponse, SimklClientSettings, SimklClientAuthentication> implements SimklApi {
  /**
   * Creates an instance of BaseMalClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: SimklClientOptions, authentication: SimklClientAuthentication = {}, api: ISimklApi = {}) {
    super(options, authentication, api);
  }

  /**
   * Parses the template to construct the headers for a Mal API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param {SimklApiTemplate<T>} template - The template for the API endpoint.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if OAuth is required and the access token is missing.
   */
  protected _parseHeaders<T extends SimklApiParams = SimklApiParams>(template: SimklApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [BaseApiHeaders.UserAgent]: this.settings.useragent,
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [SimklApiHeader.SimklApiKey]: this.settings.client_id,
    };

    if (template.opts?.auth === SimklApiAuthType.Client && !this.settings.client_id) {
      throw new SimklInvalidParameterError('OAuth required: access_token is missing');
    }
    if (template.opts?.auth === SimklApiAuthType.User && !this.auth.access_token) {
      throw new SimklInvalidParameterError('OAuth required: access_token is missing');
    }
    if (template.opts?.auth && this.auth.access_token) {
      headers[BaseApiHeaders.Authorization] = `Bearer ${this.auth.access_token}`;
    }

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Mal API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Mal API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends SimklApiParams = SimklApiParams>(template: SimklApiTemplate<T>, params: T): URL {
    if (template.opts.endpoint) return parseUrl<T>(template, params, template.opts.endpoint);
    const _template = injectCorsProxyPrefix(template, this.settings);
    return parseUrl<T>(_template, params, this.settings.endpoint);
  }

  /**
   * Parses body from a template and stringifies a {@link BodyInit}
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The expected body structure.
   * @param {T} params - The actual parameters.
   *
   * @returns {BodyInit} The parsed request body.
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseBody<T extends SimklApiParams = SimklApiParams>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    if (params.payload) return JSON.stringify(params.payload);
    return parseBody(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {SimklApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse<T extends RecursiveRecord = unknown>(response: SimklApiResponse<T>): SimklApiResponse {
    return parseResponse(response);
  }
}
