import { HttpMethod } from '@dvcol/common-utils/http';

import type {
  SimklAnime,
  SimklAnimeAiring,
  SimklAnimeAiringRequest,
  SimklAnimeBest,
  SimklAnimeBestRequest,
  SimklAnimeEpisode,
  SimklAnimeEpisodesRequest,
  SimklAnimeGenre,
  SimklAnimeGenreRequest,
  SimklAnimeIdRequest,
  SimklAnimePremiere,
  SimklAnimePremieresRequest,
  SimklAnimeTrending,
  SimklAnimeTrendingRequest,
} from '~/models/simkl-anime.model';

import { SimklApiTransform } from '~/api/transforms/simkl-api.transform';
import { SimklAnimeGenreSection } from '~/models/simkl-anime.model';

import { SimklApiAuthType, SimklApiExtended, SimklClientEndpoint } from '~/models/simkl-client.model';
import { SimklBestFilter, SimklPremiereParam } from '~/models/simkl-common.model';

export const anime = {
  /**
   * Get detail info about the Anime
   *
   * Same as /tv/:id endpoint + added anime_type,en_title fields.
   *
   * @see [anime-summary](https://simkl.docs.apiary.io/reference/anime/summary/get-detail-info-about-the-anime}
   */
  id: new SimklClientEndpoint<SimklAnimeIdRequest, SimklAnime>({
    method: HttpMethod.GET,
    url: '/anime/:id',
    opts: {
      auth: SimklApiAuthType.Client,
      extends: SimklApiExtended.Full,
      parameters: {
        path: {
          id: true,
        },
        query: {
          extended: false,
        },
      },
    },
    transform: SimklApiTransform.Extends[SimklApiExtended.Full],
  }),
  /**
   * Get Anime episodes
   *
   * @auth client
   * @extended full
   *
   * @see [anime-episodes](https://simkl.docs.apiary.io/reference/anime/episodes/get-anime-episodes}
   */
  episodes: new SimklClientEndpoint<SimklAnimeEpisodesRequest, SimklAnimeEpisode[]>({
    method: HttpMethod.GET,
    url: '/anime/episodes/:id',
    opts: {
      auth: SimklApiAuthType.Client,
      extends: SimklApiExtended.Full,
      parameters: {
        path: {
          id: true,
        },
        query: {
          extended: false,
        },
      },
    },
    transform: SimklApiTransform.Extends[SimklApiExtended.Full],
  }),
  /**
   * Get trending anime series
   *
   * @auth client
   * @extended discover
   *
   * @see [anime-trending](https://simkl.docs.apiary.io/reference/anime/trending/get-trending-anime-series}
   */
  trending: new SimklClientEndpoint<SimklAnimeTrendingRequest, SimklAnimeTrending[]>({
    method: HttpMethod.GET,
    url: '/anime/trending/:interval',
    opts: {
      auth: SimklApiAuthType.Client,
      extends: SimklApiExtended.Discover,
      parameters: {
        path: {
          interval: false,
        },
        query: {
          extended: false,
        },
      },
    },
    transform: SimklApiTransform.Extends[SimklApiExtended.Discover],
  }),
  /**
   * Get items filtered by genre, years etc...
   *
   * This endpoint accepts all parameters from the https://simkl.com/anime/all/, select the necessary filters and copy parameters from the url.
   * Genres API duplicates the urls of the Genres on the website so create a filter on the website and add it to genres API.
   *
   * @auth client
   * @pagination true
   *
   * @see [anime-genres](https://simkl.docs.apiary.io/reference/anime/genres/get-items-filtered-by-genre,-years-etc...}
   */
  genres: new SimklClientEndpoint<SimklAnimeGenreRequest, SimklAnimeGenre[]>({
    method: HttpMethod.GET,
    url: '/anime/genres/:genre/:type/:network/:year/:sort',
    seed: {
      genre: SimklAnimeGenreSection.All,
    },
    opts: {
      auth: SimklApiAuthType.Client,
      pagination: true,
      parameters: {
        path: {
          genre: false,
          type: false,
          network: false,
          year: false,
          sort: false,
        },
        query: {
          page: false,
          limit: false,
        },
      },
    },
  }),

  /**
   * Get latest premieres
   *
   * @auth client
   * @pagination true
   *
   * @see [anime-premieres](https://simkl.docs.apiary.io/reference/anime/premieres/get-latest-premieres}
   */
  premieres: new SimklClientEndpoint<SimklAnimePremieresRequest, SimklAnimePremiere[]>({
    method: HttpMethod.GET,
    url: '/anime/premieres/:param',
    seed: {
      param: SimklPremiereParam.New,
    },
    opts: {
      auth: SimklApiAuthType.Client,
      pagination: true,
      parameters: {
        path: {
          param: true,
        },
        query: {
          type: false,

          page: false,
          limit: false,
        },
      },
    },
  }),
  /**
   * Get Airing Anime
   *
   * @auth client
   *
   * @see [anime-airing](https://simkl.docs.apiary.io/reference/anime/airing/get-airing-anime}
   */
  airing: new SimklClientEndpoint<SimklAnimeAiringRequest, SimklAnimeAiring[]>({
    method: HttpMethod.GET,
    url: '/anime/airing',
    opts: {
      auth: SimklApiAuthType.Client,
      parameters: {
        query: {
          date: false,
          sort: false,
        },
      },
    },
  }),
  /**
   * Get best of all Anime
   *
   * @auth client
   *
   * @see [anime-best](https://simkl.docs.apiary.io/reference/anime/best/get-best-of-all-anime}
   */
  best: new SimklClientEndpoint<SimklAnimeBestRequest, SimklAnimeBest[]>({
    method: HttpMethod.GET,
    url: '/anime/best/:filter',
    seed: {
      filter: SimklBestFilter.All,
    },
    opts: {
      auth: SimklApiAuthType.Client,
      parameters: {
        path: {
          filter: true,
        },
        query: {
          type: false,
        },
      },
    },
  }),
};
