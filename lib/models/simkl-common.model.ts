export type SimklIds = {
  simkl_id: number;
  imdb: string;
  tvdb: number;
  tmdb: number;
  mal: number;
  anidb: number;
  slug: string;
};

export type SimklIdsExtended = SimklIds & {
  simkl: number;
  netflix: number;
  hulu: string;

  // Anime
  animeplanet: string;
  anilist: number;
  ann: number;
  schel: number;
  anison: number;
  anisearch: number;
  crunchyroll: string;
  kitsu: number;
  livechart: number;

  // Shows
  tvdbslug: string;
  zap2it: string;
  tmdbtv: number;
  traktslug: string;

  // Movies
  tvdbmslug: string;
  tvdbm: number;
  letterslug: string;
  moviedb: number;
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
