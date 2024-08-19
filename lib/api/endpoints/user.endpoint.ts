import { HttpMethod } from '@dvcol/common-utils/http';

import type {
  SimklUserLastArt,
  SimklUserLastArtRedirectRequest,
  SimklUserLastArtRequest,
  SimklUserSettings,
  SimklUserStats,
  SimklUserStatsRequest,
} from '~/models/simkl-user.model';

import { SimklApiAuthType, SimklClientEndpoint } from '~/models/simkl-client.model';

/**
 * User's public data will return all info with GET methods without OAuth\PIN authorization.
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/reference/users}
 */
export const user = {
  /**
   * Get images for user's last watched TV Show or Movie.
   * Useful for example to create an app that will update user's wallpaper on computer or phone
   *
   * @see [documentation]{@link https://simkl.docs.apiary.io/reference/users/last-watched-arts}
   */
  arts: {
    /**
     * Get last watched images and data
     *
     * Will reply with user's id, Show\Movie URL, Show\Movie title, large poster, and large fanart image.
     *
     * @auth client
     *
     * @see [last-art](https://simkl.docs.apiary.io/reference/users/last-watched-arts/get-last-watched-images-and-data}
     */
    last: new SimklClientEndpoint<SimklUserLastArtRequest, SimklUserLastArt>({
      method: HttpMethod.GET,
      url: '/users/recently-watched-background/:id',
      opts: {
        auth: SimklApiAuthType.Client,
        parameters: {
          path: {
            id: true,
          },
        },
      },
    }),
    /**
     * Will simply redirect to the image for your app to download or display.
     *
     * @auth client
     *
     * @see [redirect-last-art](https://simkl.docs.apiary.io/reference/users/last-watched-arts/redirect-to-last-watched-image
     */
    redirect: new SimklClientEndpoint<SimklUserLastArtRedirectRequest>({
      method: HttpMethod.GET,
      url: '/users/recently-watched-background/:id',
      opts: {
        auth: SimklApiAuthType.Client,
        parameters: {
          path: {
            id: true,
          },
          query: {
            image: true,
            client_id: false,
          },
        },
      },
    }),
  },
  /**
   * You can sync user's settings with your apps/site settings
   *
   * @auth user
   *
   * @see [settings](https://simkl.docs.apiary.io/reference/users/settings/receive-settings}
   */
  settings: new SimklClientEndpoint<Record<string, never>, SimklUserSettings>({
    method: HttpMethod.GET,
    url: '/users/settings',
    opts: {
      auth: SimklApiAuthType.User,
    },
  }),
  /**
   * Get all info about user's watched movies, tv shows, anime and episodes.
   * Some users profiles are private so you need to pass token to see their stats.
   *
   * @auth user or client - require token for private profiles.
   *
   * @see [stats](https://simkl.docs.apiary.io/reference/users/stats/get-watched-statistics}
   */
  stats: new SimklClientEndpoint<SimklUserStatsRequest, SimklUserStats>({
    method: HttpMethod.GET,
    url: '/users/:id/stats',
    opts: {
      auth: SimklApiAuthType.Both,
      parameters: {
        path: {
          id: true,
        },
      },
    },
  }),
};
