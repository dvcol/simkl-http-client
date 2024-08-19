export type SimklIdsShort = {
  simkl: number;
  simkl_id: number;
  slug: string;
  imdb: number | string;
  tvdb: number | string;
  tmdb: number | string;
  mal: number | string;
};

export type SimklIdsExtended = SimklIdsShort & {
  netflix: number | string;
  hulu: string;

  // Anime
  anidb: number | string;
  animeplanet: string;
  anilist: number | string;
  ann: number | string;
  schel: number | string;
  anison: number | string;
  anisearch: number | string;
  crunchyroll: string;
  kitsu: number | string;
  livechart: number | string;
  allcin: number | string;

  // Shows
  tvdbslug: string;
  zap2it: string;
  tmdbtv: number | string;
  traktslug: string;

  // Movies
  tvdbmslug: string;
  tvdbm: number | string;
  letterslug: string;
  moviedb: number | string;

  // Socials
  fb: string;
  instagram: string;
  tw: string;

  // Website
  wikien: string;
  wikijp: string;
  offjp: string;
  offen: string;
};

export type SimklIds<K extends keyof T, T = SimklIdsExtended> = Partial<SimklIdsExtended> & {
  [P in K]: T[P];
};

export const SimklEntityType = {
  Short: 'short',
  Extended: 'extended',
  Unknown: 'unknown',
} as const;

export type SimklEntityTypes = (typeof SimklEntityType)[keyof typeof SimklEntityType];

export const SimklMediaType = {
  Movie: 'movie',
  Show: 'show',
  Anime: 'anime',
} as const;

export type SimklMediaTypes = (typeof SimklMediaType)[keyof typeof SimklMediaType];

export type SimklIdQuery = {
  simkl?: number | string;
  /** can be IMDB ID or full IMDB URL. All other parameters can be empty if this one specified. */
  imdb?: number | string;
  /** TVDB ID. All other parameters can be empty if this one specified. */
  tvdb?: number | string;
  /** The Movie Database (TMDb) ID. To search TV Shows specify type parameter. All other parameters can be empty if this one specified. */
  tmdb?: false;
  /** AniDB ID. All other parameters can be empty if this one specified. */
  anidb?: number | string;
  /** MyAnimeList id */
  mal?: number | string;
  /** AniList ID */
  anilist?: number | string;
  /** hulu_id. All other parameters can be empty if this one specified. */
  hulu?: number | string;
  /** Netflix movieid, this parameter is in beta and may not work. */
  netflix?: number | string;
  /** Crunchyroll ID. You can pass episode ID or url ID */
  crunchyroll?: number | string;
  kitsu?: number | string;
  livechart?: number | string;
  anisearch?: number | string;
  animeplanet?: string;
  traktslug?: string;
  letterboxd?: string;
};

export type SimklInfoQuery = {
  /** TV show, anime, or movie title. */
  title?: string;
  /** Release year. */
  year?: number | string;
  /**
   * If set, movies will be ignored. Anime do not have seasons.
   * Default: 1
   */
  season?: number | string;
  /**
   * If set, movies will be ignored.
   */
  episode?: number | string;
  /**
   * Required for better search by tmdb title field.
   * - Use 'show' to search both anime and tv.
   * - Use 'anime' to limit the search by title in anime.
   * - 'movie' is theatrical movie, not anime movie.
   */
  type?: SimklEntityTypes;
};

export type SimklCommonQuery = SimklIdQuery & SimklInfoQuery;

export type SimklAirDate = {
  day: string;
  time: string;
  timezone: string;
};

export const SimklAnimeAndShowStatus = {
  Airing: 'airing',
  Ended: 'ended',
  Tba: 'tba',
} as const;

export type SimklAnimeAndShowStatuses = (typeof SimklAnimeAndShowStatus)[keyof typeof SimklAnimeAndShowStatus];

export const SimklMovieStatus = {
  Released: 'released',
  Upcoming: 'upcoming',
} as const;

export type SimklMovieStatuses = (typeof SimklMovieStatus)[keyof typeof SimklMovieStatus];

export const SimklMediaStatus = {
  ...SimklAnimeAndShowStatus,
  ...SimklMovieStatus,
} as const;

export type SimklMediaStatuses = (typeof SimklMediaStatus)[keyof typeof SimklMediaStatus];

export type SimklTrailer = {
  name: string;
  youtube: string;
  size: number;
};
