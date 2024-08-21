import { ClientEndpoint } from '@dvcol/base-http-client';

import type {
  BaseOptions,
  BaseQuery,
  BaseRequest,
  BaseSettings,
  BaseTemplate,
  BaseTemplateOptions,
  ResponseOrTypedResponse,
} from '@dvcol/base-http-client';

import type { RecursiveRecord } from '@dvcol/common-utils/common/models';
import type { CancellablePromise } from '@dvcol/common-utils/http/fetch';

/**
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/required-headers}
 */
export const SimklApiHeader = {
  /** Simkl api key for the app */
  SimklApiKey: 'simkl-api-key',
  /** Current page */
  XPaginationPage: 'X-Pagination-Page',
  /** Items per page. */
  XPaginationLimit: 'X-Pagination-Limit',
  /** Total number of pages. */
  XPaginationPageCount: 'X-Pagination-Page-Count',
  /** Total number of items. */
  XPaginationItemCount: 'X-Pagination-Item-Count',
} as const;

export type SimklApiHeaders = (typeof SimklApiHeader)[keyof typeof SimklApiHeader];

/**
 * By default, methods are not returning additional data for movies, anime, show etc.
 * They return minimal info you need to match in the local database. But, if you need more information just add extended={fields} to the URL.
 *
 * Possible comma separated values for the Discover endpoints.
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/full-info}
 */
export const SimklApiExtended = {
  /** Complete info, except discover endpoints */
  Full: 'full',
  Discover: 'discover',
  Unknown: 'unknown',
} as const;

/**
 * Represents the supported extensions for the API.
 * @see {SimklApiExtended}
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/full-info}
 */
export type SimklApiExtends = (typeof SimklApiExtended)[keyof typeof SimklApiExtended];

/**
 * Possible comma separated values for the Discover endpoints.
 * theater value requires &user-country=us variable, otherwise US country will be taken.
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/full-info}
 *
 */
export const SimklApiDiscoverExtended = {
  Title: 'title',
  Slug: 'slug',
  Overview: 'overview',
  Metadata: 'metadata',
  /** Requires &user-country=us variable, otherwise US country will be taken. */
  Theater: 'theater',
  Genres: 'genres',
  Tmdb: 'tmdb',
  All: ['title', 'slug', 'overview', 'metadata', 'theater', 'genres', 'tmdb'] as const,
} as const;

/**
 * Represents the supported extensions for the API.
 * @see {SimklApiDiscoverExtended}
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/full-info}
 */
export type SimklApiDiscoverExtends = (typeof SimklApiDiscoverExtended)[keyof Omit<typeof SimklApiDiscoverExtended, 'All'>];

export type SimklApiParamsExtended<E extends SimklApiExtends = typeof SimklApiExtended.Unknown> = E extends typeof SimklApiExtended.Full
  ? {
      /** Extended response with full information */
      extended?: boolean | typeof SimklApiExtended.Full;
    }
  : E extends typeof SimklApiExtended.Discover
    ? {
        /** Extended response with optional discover information  */
        extended?: boolean | string | SimklApiDiscoverExtends | SimklApiDiscoverExtends[];
      }
    : {
        /** Extended response with full or optional discover information */
        extended?: boolean | typeof SimklApiExtended.Full | SimklApiDiscoverExtends | SimklApiDiscoverExtends[];
      };

/**
 * Paginated endpoints will load 1 page of 10 items by default.
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#introduction/about-simkl-api/pagination}
 */
export type SimklApiClientPagination = {
  /** Number of page of results to be returned. (defaults to 1) */
  page: number;
  /** Number of results to return per page. (defaults to 10) */
  limit: number;
  /** Total number of pages */
  pageCount: number;
  /** Total number of items */
  itemCount: number;
};

export type SimklApiParamsPagination = Partial<Pick<SimklApiClientPagination, 'page' | 'limit'>>;

export type SimklApiParams<
  T extends RecursiveRecord | RecursiveRecord[] = RecursiveRecord,
  E extends SimklApiExtends = SimklApiExtends,
> = SimklApiParamsExtended<E> & SimklApiParamsPagination & T;

export type SimklClientAuthentication = {
  access_token?: string;
  created?: number;
  state?: string;
};

/**
 * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2}
 */
export type SimklClientSettings = BaseSettings<{
  /** The client ID you received from MyAnimeList when you registered your application. */
  client_id: string;
  /** The client secret you received from MyAnimeList when you registered your application. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri?: string;

  /** The consumer client identifier */
  useragent: string;
}>;

export type SimklApiQuery<T = unknown> = BaseQuery<BaseRequest, T>;

export type SimklApiResponse<T = unknown> = ResponseOrTypedResponse<T> & {
  pagination?: SimklApiClientPagination;
};

export type SimklClientOptions = BaseOptions<SimklClientSettings, SimklApiResponse>;

export const SimklApiAuthType = {
  User: 'user',
  Client: 'client',
  Both: 'both',
} as const;

export type SimklApiAuthTypes = (typeof SimklApiAuthType)[keyof typeof SimklApiAuthType];

export type SimklApiTemplateOptions<T extends string | number | symbol = string> = BaseTemplateOptions<T, boolean> & {
  /** Optional endpoint override */
  endpoint?: string;
  /** If the endpoint supports/requires pagination */
  pagination?: boolean;
  /** The auth type required if any */
  auth?: SimklApiAuthTypes | false;
  /** If the endpoint supports extended information */
  extends?: SimklApiExtends;
};

export type SimklApiTemplate<Parameter extends SimklApiParams = SimklApiParams> = BaseTemplate<Parameter, SimklApiTemplateOptions<keyof Parameter>>;

export interface SimklClientEndpoint<Parameter extends SimklApiParams = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BodyInit): CancellablePromise<SimklApiResponse<Response>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SimklClientEndpoint<
  Parameter extends SimklApiParams = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, SimklApiTemplateOptions<keyof Parameter>> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
export type ISimklApi<Parameter extends SimklApiParams = any, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: SimklClientEndpoint<Parameter, Response, Cache> | ISimklApi<Parameter>;
};
