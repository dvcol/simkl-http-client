import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklRedirectRequest, SimklRedirectWatchedRequest } from '~/models/simkl-redirect.model';

import { SimklApiAuthType, SimklClientEndpoint } from '~/models';

/**
 * Redirect to Simkl, trailer or Twitter
 *
 * In situations when you want to link directly to the Movie or TV show episode on Simkl from your Website or APP but don't know Simkl URL, you can use the Redirect API.
 * Redirect users directly to Simkl page, Trailer or to Twitter (to Share a Simkl link on Twitter with prefilled data).
 *
 * Use CasesHere are some examples of the things you can build with the Redirect API:
 * - A browser extension to quickly link to Simkl based on page content.
 * - A website page linking directly to Simkl based on IMDB ID or TV Show name.
 * - Link to a trailer knowing only Movie name and year.
 * - Share an episode on Twitter from your browser extension.Get all Simkl IDs for your own API.
 *
 * @see [redirect]{@link https://simkl.docs.apiary.io/reference/redirect}
 */
export const redirect = {
  /**
   * Use this if you want to make a redirect to Simkl or (fast post) to Twitter using show's title or id. It will return "location" header.
   *
   * The more parameters you'll pass, the more accurate redirect will be.
   *
   * Type show combine tv and anime types.
   *
   * The response will include the "location" header (browser redirect) where the user should be redirected.
   *
   * @see [redirect]{@link https://simkl.docs.apiary.io/reference/redirect/redirect-to-simkl-trailer-or-twitter/redirect}
   */
  to: new SimklClientEndpoint<SimklRedirectRequest, unknown, false>({
    method: HttpMethod.GET,
    url: '/redirect',
    opts: {
      cache: false,
      parameters: {
        query: {
          to: false,

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
   * On first use, the user will be shown the Allow dialog to allow your app mark as watched in his profile and then redirected to the episode or movie with "Marked as watched notification".
   *
   * Currently supports marking episodes in TV Shows and Anime.
   *
   * @auth client
   *
   * @see [watched]{@link https://simkl.docs.apiary.io/reference/redirect/redirect-to-simkl-trailer-or-twitter/mark-as-watched}
   */
  watched: new SimklClientEndpoint<SimklRedirectWatchedRequest, unknown, false>({
    method: HttpMethod.GET,
    url: '/redirect',
    seed: {
      to: 'watched',
    },
    opts: {
      cache: false,
      auth: SimklApiAuthType.Client,
      parameters: {
        query: {
          to: true,
          client_id: false,

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
};
