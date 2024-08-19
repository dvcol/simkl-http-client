import { ValidatorUtils } from '@dvcol/base-http-client/utils/validator';
import { HttpMethod } from '@dvcol/common-utils/http';

import type {
  SimklSearchFileResponse,
  SimklSearchIdRequest,
  SimklSearchIdResponse,
  SimklSearchTextRequest,
  SimklSearchTextResponse,
} from '~/models/simkl-search.model';

import { SimklApiTransform } from '~/api/transforms/simkl-api.transform';
import { SimklApiAuthType, SimklApiExtended, SimklClientEndpoint } from '~/models/simkl-client.model';

export const search = {
  /**
   * You can lookup items by their ID using this endpoint.
   *
   * Supports IMDB, TVDB, TMDB, AniDB, Hulu, Netflix, MAL, Crunchyroll ID.
   *
   * @auth client
   *
   * @see [id-lookup]{@link https://simkl.docs.apiary.io/reference/search/id-lookup/get-items-by-id}
   */
  id: new SimklClientEndpoint<SimklSearchIdRequest, SimklSearchIdResponse>({
    method: HttpMethod.GET,
    url: '/search/id',
    opts: {
      auth: SimklApiAuthType.Client,
      parameters: {
        query: {
          title: false,
          year: false,
          season: false,
          episode: false,
          type: false,

          simkl: false,
          imdb: false,
          tvdb: false,
          tmdb: false,
          anidb: false,
          mal: false,
          anilist: false,
          hulu: false,
          netflix: false,
          crunchyroll: false,
          kitsu: false,
          livechart: false,
          anisearch: false,
          animeplanet: false,
          traktslug: false,
          letterboxd: false,
        },
      },
    },
  }),
  /**
   * Search items by title, sorted by relevance (what people search most).
   *
   * This method will respond with Standard Media Object + additional fields if extended parameter passed.
   * For movies or anime with movie type, tmdb id points to the movies section on TMDB site, otherwise to the TV section.
   *
   * Page limit is 20, max items per page is 50
   *
   * @auth client
   * @pagination true
   * @extended full
   *
   * @see [text-search]{@link https://simkl.docs.apiary.io/reference/search/text/get-items-based-on-text-query}
   */
  text: new SimklClientEndpoint<SimklSearchTextRequest, SimklSearchTextResponse>({
    method: HttpMethod.GET,
    url: '/search/:type',
    opts: {
      auth: SimklApiAuthType.Client,
      extends: SimklApiExtended.Full,
      pagination: true,
      parameters: {
        path: {
          type: true,
        },
        query: {
          q: true,

          page: false,
          limit: false,

          extended: false,
        },
      },
    },
    transform: SimklApiTransform.Extends[SimklApiExtended.Full],
    validate: params => {
      if (params.limit) ValidatorUtils.minMax(params.limit, { min: 0, max: 50, name: 'limit' });
      if (params.page) ValidatorUtils.minMax(params.page, { min: 0, max: 20, name: 'page' });
      return true;
    },
  }),
  /**
   * Use it if you have a filename and want to get simkl_id based on it.
   * Right now TV Shows and Anime files can be recognized the best.
   * Movies are harder to recognize without using the hash.
   * You can search by filename or by full folder+filename (see request examples).
   *
   * @see [file-search]{@link https://simkl.docs.apiary.io/reference/search/file/find-show,-anime-or-movie-by-file}
   */
  file: new SimklClientEndpoint<SimklSearchTextRequest, SimklSearchFileResponse>({
    method: HttpMethod.POST,
    url: '/search/file',
    body: {
      file: true,
      part: false,
      hash: false,
    },
    opts: {
      auth: SimklApiAuthType.Client,
    },
  }),
};
