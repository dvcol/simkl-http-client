import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklRating, SimklRatingRequest } from '~/models/simkl-rating.model';

import { SimklApiAuthType, SimklClientEndpoint } from '~/models/simkl-client.model';

/**
 *
 * Get movie, tv show or anime rating
 *
 * Returns rating (between 0 and 10), rank (movie, tv, anime have their own rank), external ratings (IMDB, MAL), drop rate and if we have trailers for the movie or not(add /trailer parameter to the link and the best trailer will be opened).
 *
 * Possible url parameters: see [Redirect method]{@link https://simkl.docs.apiary.io/#reference/redirect/redirect-to-simkl-trailer-or-twitter/redirect}.
 *
 * @auth client
 *
 * @see [ratings]{@link https://simkl.docs.apiary.io/reference/ratings}
 */
export const ratings = new SimklClientEndpoint<SimklRatingRequest, SimklRating>({
  method: HttpMethod.GET,
  url: '/ratings',
  opts: {
    auth: SimklApiAuthType.Client,
    parameters: {
      query: {
        fields: false,

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
  transform: param => {
    if (param.fields && Array.isArray(param.fields)) return { ...param, fields: param.fields.join(',') };
    return param;
  },
});
