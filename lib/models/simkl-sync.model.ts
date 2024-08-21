import type { SimklAnimeTypes } from '~/models/simkl-anime.model';
import type { SimklApiExtended, SimklApiParamsExtended } from '~/models/simkl-client.model';
import type { SimklIds } from '~/models/simkl-common.model';

import type { SimklEpisodeShort } from '~/models/simkl-episode.model';
import type { SimklMovieShort } from '~/models/simkl-movie.model';
import type { SimklShowShort } from '~/models/simkl-show.model';

export const SimklSyncHistoryType = {
  Shows: 'shows',
  Movies: 'movies',
  Anime: 'anime',
} as const;

export type SimklSyncHistoryTypes = (typeof SimklSyncHistoryType)[keyof typeof SimklSyncHistoryType];

export const SimklSyncHistoryStatus = {
  Watching: 'watching',
  PlanToWatch: 'plantowatch',
  Hold: 'hold',
  Completed: 'completed',
  Dropped: 'dropped',
} as const;

export type SimklSyncHistoryStatuses = (typeof SimklSyncHistoryStatus)[keyof typeof SimklSyncHistoryStatus];

export type SimklSyncHistoryRequest = {
  type?: SimklSyncHistoryTypes;
  status?: SimklSyncHistoryStatuses;
  /** Returns the date when user watched the episode (watched_at). */
  episode_watched_at?: boolean | 'yes';
  /** Returns the items updated from the passed value. */
  date_from?: string;
  /** Returns more info about next to watch episodes. */
  next_watch_info?: boolean | 'yes';
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type NextToWatch = {
  title: string;
  episode: number;
  date: string;
};

export type SimklSyncHistoryEpisode = {
  watched_at?: string;
  number: number;
};

export type SimklSyncHistorySeason = {
  watched_at?: string;
  number: number;
  episodes?: SimklSyncHistoryEpisode[];
};

export type SimklSyncHistoryBase = {
  status: SimklSyncHistoryStatuses;
  last_watched_at?: string;
  user_rating?: number;
  watched_episodes_count: number;
  total_episodes_count: number;
  not_aired_episodes_count: number;
};

export type SimklSyncHistoryShow = SimklSyncHistoryBase & {
  last_watched?: string;
  next_to_watch?: string;
  next_to_watch_info?: NextToWatch;
  seasons?: SimklSyncHistorySeason[];
  show: {
    title: string;
    poster: string;
    year: number;
    ids: SimklIds<'simkl' | 'slug'>;
  };
};

export type SimklSyncHistoryAnime = SimklSyncHistoryBase & {
  last_watched?: string;
  next_to_watch?: string;
  anime_type: SimklAnimeTypes;
  next_to_watch_info?: NextToWatch;
  seasons?: SimklSyncHistorySeason[];
  show: {
    title: string;
    poster: string;
    year: number;
    ids: SimklIds<'simkl' | 'mal'>;
  };
};

export type SimklSyncHistoryMovie = SimklSyncHistoryBase & {
  movie: {
    title: string;
    poster: string;
    year: number;
    ids: SimklIds<'simkl' | 'imdb'>;
  };
};

export type SimklSyncHistoryResponse = {
  shows: SimklSyncHistoryShow[];
  anime: SimklSyncHistoryAnime[];
  movies: SimklSyncHistoryMovie[];
};

export type SimklSyncAddHistoryItem = {
  memo?: string;
  rating?: number;
  watched_at?: string;
  ids: SimklIds<'simkl'>;
};

export type SimklSyncAddHistoryMovie = Partial<SimklMovieShort> & SimklSyncAddHistoryItem;

export type SimklSyncAddHistoryShow = Partial<SimklShowShort> & {
  seasons?: SimklSyncHistorySeason[];
} & SimklSyncAddHistoryItem;

export type SimklSyncAddHistoryEpisode = {
  watched_at?: string;
  ids: SimklIds<'simkl'>;
};

export type SimklSyncAddHistoryRequest = {
  movies?: SimklSyncAddHistoryMovie[];
  shows?: SimklSyncAddHistoryShow[];
  episodes?: SimklSyncAddHistoryEpisode[];
};

export type SimklSyncAddHistoryResponse = {
  added: {
    movies: number;
    shows: number;
    episodes: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};

export type SimklSyncRemoveHistoryRequest = {
  movies?: SimklSyncAddHistoryMovie[];
  shows?: SimklSyncAddHistoryShow[];
};

export type SimklSyncRemoveHistoryResponse = {
  deleted: {
    movies: number;
    shows: number;
    episodes: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};

export type SimklSyncRatingRequest = {
  type?: SimklSyncHistoryTypes;
  rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  date_from?: string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklSyncRatingItem = {
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rated_at?: string;
  ids: SimklIds<'simkl'>;
};

export type SimklSyncRatingMovie = Partial<SimklMovieShort> & SimklSyncRatingItem;
export type SimklSyncRatingShow = Partial<SimklShowShort> & SimklSyncRatingItem;

export type SimklSyncAddRatingRequest = {
  movies?: SimklSyncRatingMovie[];
  shows?: SimklSyncRatingShow[];
};

export type SimklSyncAddRatingResponse = {
  added: {
    movies: number;
    shows: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};

export type SimklSyncRemoveRatingItem<T> = {
  ids: SimklIds<'simkl'>;
} & T;

export type SimklSyncRemoveRatingRequest = {
  movies?: SimklSyncRemoveRatingItem<Partial<SimklMovieShort>>[];
  shows?: SimklSyncRemoveRatingItem<Partial<SimklShowShort>>[];
};

export type SimklSyncRemoveRatingResponse = {
  deleted: {
    movies: number;
    shows: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};

export type SimklSyncAddToListItem<T> = {
  ids: SimklIds<'simkl'>;
  to: SimklSyncHistoryStatuses | string;
  /** UTC datetime when the item was watched, available only for "completed" status */
  watched_at?: string;
} & T;

export type SimklSyncAddToListRequest = {
  movies?: SimklSyncAddToListItem<Partial<SimklMovieShort>>[];
  shows?: SimklSyncAddToListItem<Partial<SimklShowShort>>[];
};

export type SimklSyncAddToListResponse = {
  added: {
    movies: SimklSyncAddToListItem<Partial<SimklMovieShort>>[];
    shows: SimklSyncAddToListItem<Partial<SimklShowShort>>[];
  };
  not_found: {
    movies: SimklSyncAddToListItem<Partial<SimklMovieShort>>[];
    shows: SimklSyncAddToListItem<Partial<SimklShowShort>>[];
  };
};
export type SimklSyncCheckRequestItem = {
  /** Movie or TV Show\Anime name */
  title?: string;
  /** Release year */
  year?: number | string;
  /** TV Show Season */
  season?: number | string;
  /** TV Show Episode number */
  episode?: number | string;
  /** Simkl ID */
  simkl?: number | string;
  /**  hulu_id. All other parameters can be empty if this one specified. */
  hulu?: number | string;
  /** Netflix movieid, this parameter is in beta and may not always work. */
  netflix?: number | string;
  /** MyAnimeList ID */
  mal?: number | string;
  /** TheTVDB ID. all other parameters can be empty if this one specified. */
  tvdb?: number | string;
  /** Required fore tmdb, if it's a TV Show */
  type?: 'show' | 'movie';
  /** The Movie Database (TMDb) ID. If you are searching for a TV Show, specify type param as well. All other parameters can be empty if this one specified. */
  tmdb?: number | string;
  /** Can be IMDB ID or full IMDB URL. All other parameters can be empty if this one specified. */
  imdb?: string;
  /** AniDB ID. All other parameters can be empty if this one specified. */
  anidb?: number | string;
};

export type SimklSyncCheckRequest = {
  payload: SimklSyncCheckRequestItem[];
};

export type SimklSyncCheckResponseItem = SimklSyncCheckRequestItem & {
  list?: SimklSyncHistoryStatuses;
  watched?: string;
  last_watched?: string;
  /**
   * - true: Found a match and found in user's watchlist
   * - false: Found a match but could not find in user's watchlist
   * - 'not_found': Could not find a match in Simkl database with such Title\Year or ID
   */
  result?: boolean | 'not_found';
};

export type SimklSyncCheckResponse = SimklSyncCheckResponseItem[];

export type SimklSyncAddToCollectionItem<T> = {
  /** UTC datetime when the item was collected. Will be used current if the parameter is skipped. */
  collected_at?: string;
  ids: SimklIds<'simkl'>;
} & T;

export type SimklSyncAddToCollectionRequest = {
  movies?: SimklSyncAddToCollectionItem<Partial<SimklMovieShort>>[];
  shows?: SimklSyncAddToCollectionItem<Partial<SimklShowShort>>[];
  episodes?: SimklSyncAddToCollectionItem<Partial<SimklEpisodeShort>>[];
};

export type SimklSynAddedCollectionResponse = {
  added: {
    movies: number;
    shows: number;
    episodes: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};

export type SimklSyncRemoveFromCollectionItem<T> = {
  ids: SimklIds<'simkl'>;
} & T;

export type SimklSyncRemoveFromCollectionRequest = {
  movies?: SimklSyncRemoveFromCollectionItem<Partial<SimklMovieShort>>[];
  shows?: SimklSyncRemoveFromCollectionItem<Partial<SimklShowShort>>[];
};

export type SimklSyncRemoveCollectionResponse = {
  deleted: {
    movies: number;
    shows: number;
    episodes: number;
  };
  not_found: {
    movies: SimklIds<'simkl'>[];
    shows: SimklIds<'simkl'>[];
    episodes: SimklIds<'simkl'>[];
  };
};
