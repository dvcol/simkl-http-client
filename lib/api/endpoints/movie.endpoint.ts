import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklMovie, SimklMovieIdRequest, SimklMovieTrending, SimklMovieTrendingRequest } from '~/models/simkl-movie.model';

import { SimklApiTransform } from '~/api/transforms/simkl-api.transform';
import { SimklApiAuthType, SimklApiExtended, SimklClientEndpoint } from '~/models';

export const movie = {
  /**
   * Get detail info about the movie
   *
   * @auth client
   * @extended full
   *
   * @see [movie-summary](https://simkl.docs.apiary.io/reference/movies/summary/get-detail-info-about-the-movie}
   */
  id: new SimklClientEndpoint<SimklMovieIdRequest, SimklMovie>({
    method: HttpMethod.GET,
    url: '/movies/:id',
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
   * Get trending movies
   *
   * @auth client
   * @extended discover
   *
   * @see [movie-trending](https://simkl.docs.apiary.io/reference/movies/trending/get-trending-movies}
   */
  trending: new SimklClientEndpoint<SimklMovieTrendingRequest, SimklMovieTrending[]>({
    method: HttpMethod.GET,
    url: '/movies/trending/:interval',
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
};
