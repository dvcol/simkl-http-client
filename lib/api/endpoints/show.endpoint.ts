import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklEpisode } from '~/models/simkl-episode.model';

import type {
  SimklShow,
  SimklShowAiring,
  SimklShowAiringRequest,
  SimklShowBest,
  SimklShowBestRequest,
  SimklShowEpisodesRequest,
  SimklShowGenre,
  SimklShowGenreRequest,
  SimklShowIdRequest,
  SimklShowPremiere,
  SimklShowPremieresRequest,
  SimklShowTrending,
  SimklShowTrendingRequest,
} from '~/models/simkl-show.model';

import { SimklApiTransform } from '~/api/transforms/simkl-api.transform';
import { SimklApiAuthType, SimklApiExtended, SimklClientEndpoint } from '~/models/simkl-client.model';
import { SimklBestFilter, SimklPremiereParam } from '~/models/simkl-common.model';
import { SimklShowGenreSection } from '~/models/simkl-show.model';

export const show = {
  /**
   * Get detail info about the TV Show
   *
   * @auth client
   * @extended full
   *
   * @see [show-summary](https://simkl.docs.apiary.io/reference/tv/summary/get-detail-info-about-the-tv-show}
   */
  id: new SimklClientEndpoint<SimklShowIdRequest, SimklShow>({
    method: HttpMethod.GET,
    url: '/tv/:id',
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
   * Get TV Show episodes
   *
   * @auth client
   * @extended full
   *
   * @see [show-episodes](https://simkl.docs.apiary.io/reference/tv/episodes/get-tv-show-episodes}
   */
  episodes: new SimklClientEndpoint<SimklShowEpisodesRequest, SimklEpisode[]>({
    method: HttpMethod.GET,
    url: '/tv/episodes/:id',
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
   * Get trending TV series
   *
   * @auth client
   * @extended discover
   *
   * @see [show-trending](https://simkl.docs.apiary.io/reference/tv/trending/get-trending-tv-series}
   */
  trending: new SimklClientEndpoint<SimklShowTrendingRequest, SimklShowTrending[]>({
    method: HttpMethod.GET,
    url: '/tv/trending/:interval',
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
   * This endpoint accepts all parameters from the https://simkl.com/tv/all/, select the necessary filters and copy parameters from the url.
   * Genres API duplicates the urls of the Genres on the website so create a filter on the website and add it to genres API.
   *
   * @auth client
   * @pagination true
   *
   * @see [show-genres](https://simkl.docs.apiary.io/reference/tv/genres/get-items-filtered-by-genre,-years-etc...}
   */
  genres: new SimklClientEndpoint<SimklShowGenreRequest, SimklShowGenre[]>({
    method: HttpMethod.GET,
    url: '/tv/genres/:genre/:type/:country/:network/:year/:sort',
    seed: {
      genre: SimklShowGenreSection.All,
    },
    opts: {
      auth: SimklApiAuthType.Client,
      pagination: true,
      parameters: {
        path: {
          genre: false,
          type: false,
          country: false,
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
   * @see [show-premieres](https://simkl.docs.apiary.io/reference/tv/premieres/get-latest-premieres}
   */
  premieres: new SimklClientEndpoint<SimklShowPremieresRequest, SimklShowPremiere[]>({
    method: HttpMethod.GET,
    url: '/tv/premieres/:param',
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
   * Get Airing TV Shows
   *
   * @auth client
   *
   * @see [show-airing](https://simkl.docs.apiary.io/reference/tv/airing/get-airing-tv-shows}
   */
  airing: new SimklClientEndpoint<SimklShowAiringRequest, SimklShowAiring[]>({
    method: HttpMethod.GET,
    url: '/tv/airing',
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
   * Get best of all TV Shows
   *
   * @auth client
   *
   * @see [show-best](https://simkl.docs.apiary.io/reference/tv/best/get-best-of-all-tv-shows}
   */
  best: new SimklClientEndpoint<SimklShowBestRequest, SimklShowBest[]>({
    method: HttpMethod.GET,
    url: '/tv/best/:filter',
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
