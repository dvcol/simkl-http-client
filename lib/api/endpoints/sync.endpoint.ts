import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklActivity } from '~/models/simkl-activity.model';

import type {
  SimklSynAddedCollectionResponse,
  SimklSyncAddHistoryRequest,
  SimklSyncAddHistoryResponse,
  SimklSyncAddRatingRequest,
  SimklSyncAddRatingResponse,
  SimklSyncAddToCollectionRequest,
  SimklSyncAddToListRequest,
  SimklSyncAddToListResponse,
  SimklSyncCheckRequest,
  SimklSyncCheckResponse,
  SimklSyncHistoryRequest,
  SimklSyncHistoryResponse,
  SimklSyncRatingRequest,
  SimklSyncRemoveCollectionResponse,
  SimklSyncRemoveFromCollectionRequest,
  SimklSyncRemoveHistoryRequest,
  SimklSyncRemoveHistoryResponse,
  SimklSyncRemoveRatingRequest,
  SimklSyncRemoveRatingResponse,
} from '~/models/simkl-sync.model';

import { SimklApiTransform } from '~/api/transforms/simkl-api.transform';
import { SimklApiAuthType, SimklApiExtended, SimklClientEndpoint } from '~/models';

/**
 * @see [sync](https://simkl.docs.apiary.io/reference/sync}
 */
export const sync = {
  /**
   * Get last activity
   *
   * @auth user
   *
   * @see [sync-activity]{https://simkl.docs.apiary.io/reference/sync/last-activities/get-last-activity}
   */
  activity: new SimklClientEndpoint<Record<string, never>, SimklActivity>({
    method: HttpMethod.GET,
    url: '/sync/activities',
    opts: {
      auth: SimklApiAuthType.User,
    },
  }),
  history: {
    /**
     * Get all items in the user's watchlist
     *
     * Returns all items that user has in his watchlist (watching, plan to watch, dropped, completed), shows, anime, movies.
     *
     * @auth user
     * @extended full
     *
     * @see [sync-all-items]{https://simkl.docs.apiary.io/reference/sync/get-all-items/get-all-items-in-the-user's-watchlist}
     */
    get: new SimklClientEndpoint<SimklSyncHistoryRequest, SimklSyncHistoryResponse>({
      method: HttpMethod.GET,
      url: '/sync/all-items/:type/:status',
      opts: {
        auth: SimklApiAuthType.User,
        extends: SimklApiExtended.Full,
        parameters: {
          path: {
            type: false,
            status: false,
          },
          query: {
            episode_watched_at: false,
            date_from: false,
            next_watch_info: false,
            extended: false,
          },
        },
      },
      transform: SimklApiTransform.Extends[SimklApiExtended.Full],
    }),
    /**
     * Add items to watched/watching history
     *
     * Add items to the user's watched history.
     * You can pass shows, seasons, episodes and movies.
     * If no episodes for the show is passed then it will be marked as completed.
     * If seasons will be specified then only episodes in those seasons will be marked.
     *
     * If watched_at UTC datetime is passed then all will be marked as watched in the past.
     *
     * Pass as much data as possible into the item including title, year and ids fields so Simkl could detect the item better.
     *
     * @auth user
     *
     * @see [sync-add-history]{https://simkl.docs.apiary.io/reference/sync/add-items-to-the-history/add-items-to-watched/watching-history}
     */
    add: new SimklClientEndpoint<SimklSyncAddHistoryRequest, SimklSyncAddHistoryResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/history',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        episodes: false,
      },
    }),
    /**
     * Get specific user's watched items
     *
     * Use this method if you want to see which shows or episodes user has seen.
     * You can pass different ids and get their appropriate statuses in a user's list.
     *
     * @auth user
     *
     * @see [sync-check-history]{https://simkl.docs.apiary.io/reference/sync/check-if-watched/get-specific-user's-watched-items}
     */
    check: new SimklClientEndpoint<SimklSyncCheckRequest, SimklSyncCheckResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/watched',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        payload: true,
      },
    }),
    /**
     * Remove the items from the user's watched history.
     * You can pass shows, seasons, episodes and movies.
     * If no episodes are passed and the season is specified then all episodes within this season will be unmarked.
     * If seasons were skipped too then the show will be removed completely.
     * When removing show or movie, ratings are removed automatically as well for that item.
     *
     * @auth user
     *
     * @see [sync-remove-history]{https://simkl.docs.apiary.io/reference/sync/remove-items-from-history-and-from-lists/remove-items-from-watched/watching-history}
     */
    remove: new SimklClientEndpoint<SimklSyncRemoveHistoryRequest, SimklSyncRemoveHistoryResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/history/remove',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
  },
  ratings: {
    /**
     * Get all user ratings
     *
     * @auth user
     * @extended full
     *
     * @see [sync-ratings]{https://simkl.docs.apiary.io/reference/sync/get-ratings/get-all-user's-ratings}
     */
    get: new SimklClientEndpoint<SimklSyncRatingRequest, SimklSyncHistoryResponse>({
      method: HttpMethod.GET,
      url: '/sync/ratings/:type/:rating',
      opts: {
        auth: SimklApiAuthType.User,
        extends: SimklApiExtended.Full,
        parameters: {
          path: {
            type: false,
            rating: false,
          },
          query: {
            date_from: false,

            extended: false,
          },
        },
      },
      transform: SimklApiTransform.Extends[SimklApiExtended.Full],
    }),
    /**
     * Rate the movies or tv shows/anime.
     * You cannot rate the seasons or episodes right now.
     * If the show/anime or movie is rated before it was in user's list, show will be automatically added to "Watching" list and the movie will be added to "I've seen this" list.
     * Keep in mind, when removing the show/anime or movie user's ratings will be removed as well for that item.
     *
     * @auth user
     *
     * @see [sync-add-rating]{https://simkl.docs.apiary.io/reference/sync/add-ratings/add-new-ratings}
     */
    add: new SimklClientEndpoint<SimklSyncAddRatingRequest, SimklSyncAddRatingResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/ratings',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
    /**
     * Remove a rating.
     *
     * Any movies or tv shows passed here will be unrated
     *
     * @auth user
     *
     * @see [sync-remove-rating]{https://simkl.docs.apiary.io/reference/sync/remove-ratings/remove-ratings}
     */
    remove: new SimklClientEndpoint<SimklSyncRemoveRatingRequest, SimklSyncRemoveRatingResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/ratings/remove',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
  },
  list: {
    /**
     * Add items to specific list
     *
     * Add items to a user's Simkl lists.
     * For example you can add a Show directly to Plan to Watch or move existing show from Watching to Not Interesting.
     * You can pass shows and movies.
     * Pass as much data as possible into the item including title, year and ids fields so Simkl could detect the item better.
     *
     * @auth user
     *
     * @see [sync-add-list]{https://simkl.docs.apiary.io/reference/sync/add-item-to-the-list/add-items-to-specific-list}
     */
    add: new SimklClientEndpoint<SimklSyncAddToListRequest, SimklSyncAddToListResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/add-to-list',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
  },
  /**
   * Collection is a list of Shows\Movies that user has on his hard drive, CDs, DVDs, etc.
   * This feature is currently only supported in API and is not implemented on the website.
   */
  collection: {
    /**
     * If you want to add something to a user's collection use this method.
     * Accepts shows, season and movies.
     * If seasons skipped then all seasons for the show will be collected otherwise only specified seasons.
     * Items collected in the past should send collected_at UTC datetime.
     * If you send item second time then it will be updated with new values.
     *
     * @auth user
     *
     * @see [sync-add-collection]{https://simkl.docs.apiary.io/reference/sync/add-to-collection/add-items-to-collection}
     */
    add: new SimklClientEndpoint<SimklSyncAddToCollectionRequest, SimklSynAddedCollectionResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/collection',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
        episodes: false,
      },
    }),
    /**
     * Delete items from collection
     *
     * Using this method you can remove one or more items from a user's collection.
     *
     * @auth user
     *
     * @see [sync-remove-collection]{https://simkl.docs.apiary.io/reference/sync/remove-from-collection/delete-items-from-collection}
     */
    remove: new SimklClientEndpoint<SimklSyncRemoveFromCollectionRequest, SimklSyncRemoveCollectionResponse, false>({
      method: HttpMethod.POST,
      url: '/sync/collection/remove',
      opts: {
        auth: SimklApiAuthType.User,
        cache: false,
      },
      body: {
        movies: false,
        shows: false,
      },
    }),
  },
};
