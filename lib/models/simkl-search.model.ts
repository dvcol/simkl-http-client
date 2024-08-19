import type { SimklAnimeShort } from '~/models/simkl-anime.model';
import type { SimklApiExtended, SimklApiParamsExtended, SimklApiParamsPagination } from '~/models/simkl-client.model';

import type {
  SimklAnimeAndShowStatuses,
  SimklCommonQuery,
  SimklEntityType,
  SimklIds,
  SimklIdsExtended,
  SimklMovieStatuses,
} from '~/models/simkl-common.model';
import type { SimklMovieShort } from '~/models/simkl-movie.model';
import type { SimklRatings } from '~/models/simkl-rating.model';
import type { SimklShowShort } from '~/models/simkl-show.model';

export type SimklSearchIdRequest = SimklCommonQuery;

export type SimklSearchEntity = {
  title: string;
  poster: string;
  year: number;
};

export const SimklSearchEntityType = {
  Tv: 'tv',
  Anime: 'anime',
  Movie: 'movie',
} as const;

export type SimklSearchEntityTypes = (typeof SimklSearchEntityType)[keyof typeof SimklSearchEntityType];

export type SimklSearchIdShow = SimklSearchEntity & {
  type: typeof SimklSearchEntityType.Tv;
  total_episodes: number;
  status: SimklAnimeAndShowStatuses;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklSearchIdAnime = SimklSearchEntity & {
  type: typeof SimklSearchEntityType.Anime;
  total_episodes: number;
  status: SimklAnimeAndShowStatuses;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklSearchIdMovie = SimklSearchEntity & {
  type: typeof SimklSearchEntityType.Movie;
  status: SimklMovieStatuses;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklSearchIdResponse = (SimklSearchIdShow | SimklSearchIdAnime | SimklSearchIdMovie)[];

export type SimklSearchTextRequest = {
  type: SimklSearchEntityTypes;
  q: string;
} & SimklApiParamsPagination &
  SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklSearchTextShow = SimklSearchEntity & {
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
  url?: string;
  ep_count?: number;
  rank?: number;
  status?: SimklAnimeAndShowStatuses;
  ratings?: SimklRatings<'simkl' | 'imdb'>;
};

export type SimklSearchTextAnime = SimklSearchEntity & {
  title_en?: string;
  title_romaji?: string;
  type: SimklAnimeShort['type'];
  all_titles?: string[];
  url?: string;
  ep_count?: number;
  rank?: number;
  status?: SimklAnimeAndShowStatuses;
  ratings?: SimklRatings<'simkl' | 'mal'>;
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
};

export type SimklSearchTextMovie = SimklSearchEntity & {
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
  all_titles?: string[];
  url?: string;
  rank?: number;
  ratings?: SimklRatings<'simkl' | 'imdb'>;
};

export type SimklSearchTextResponse<T extends SimklSearchEntityTypes | typeof SimklEntityType.Unknown = typeof SimklEntityType.Unknown> =
  T extends typeof SimklSearchEntityType.Tv
    ? SimklSearchTextShow[]
    : T extends typeof SimklSearchEntityType.Anime
      ? SimklSearchTextAnime[]
      : T extends typeof SimklSearchEntityType.Movie
        ? SimklSearchTextMovie[]
        : T extends typeof SimklSearchEntityType.Tv
          ? SimklSearchTextShow[]
          : SimklSearchTextShow[] | SimklSearchTextAnime[] | SimklSearchTextMovie[];

export type SimklSearchFileRequest = {
  /**
   * Trying to find this file in our DB.
   *
   * You can also use folders in the file request.
   *
   * @example Were.The.Fugawis.S01E01E02.WS.DSR.x264-NY2.mkv
   *
   * @example /series/The Office/Season 4/The Office [401] Fun Run.avi
   */
  file: string;
  /**
   * Some filenames consist of 2 or more parts. If you want to get info about second part for example you can pass 2 to this parameter
   *
   * Default: 1
   */
  part?: number;
  hash?: string;
};

export type SimklSearchFileMovie = SimklMovieShort;

/** Returns episode for a Tv Show or Anime  */
export type SimklSearchFileEpisode = {
  type: 'episode';
  show: SimklShowShort;
  episode: {
    title: string;
    season: number;
    episode: number;
    multipart: 0 | 1 | boolean;
    ids: Partial<SimklIdsExtended>;
  };
};

export type SimklSearchFileResponse<T extends 'movie' | 'episode' | typeof SimklEntityType.Unknown = typeof SimklEntityType.Unknown> =
  T extends 'movie' ? SimklSearchFileMovie : T extends 'episode' ? SimklSearchFileEpisode : SimklSearchFileMovie | SimklSearchFileEpisode;
