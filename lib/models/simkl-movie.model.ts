import type { SimklApiExtended, SimklApiParamsExtended } from '~/models/simkl-client.model';

import type {
  SimklAlternativeTitle,
  SimklEntityType,
  SimklEntityTypes,
  SimklIds,
  SimklMediaType,
  SimklMovieStatuses,
  SimklTrailer,
  SimklTrendingIntervals,
} from '~/models/simkl-common.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

export type SimklMovieShort = {
  title: string;
  year: number;
  type: typeof SimklMediaType.Movie;
  ids: SimklIds<'simkl' | 'slug'>;
};

export type SimklReleaseDate = {
  type: number;
  release_date: string;
};

export type SimklLocalReleaseDate = {
  iso_3166_1: string;
  results: SimklReleaseDate[];
};

export type SimklMovieRecommendation = {
  title: string;
  year: number;
  poster: string;
  ids: SimklIds<'simkl' | 'slug'>;
};

export type SimklMovieExtended = SimklMovieShort & {
  rank: number;
  poster: string;
  fanart: string;
  released: string;
  runtime: number;
  director: string;
  certification: string;
  budget: number;
  revenue: number;
  overview: string;
  genres: string[];
  countries: string;
  languages: string;
  alt_titles: SimklAlternativeTitle[];
  ratings: SimklRatings<'simkl' | 'imdb'>;
  trailer: SimklTrailer[];
  release_dates: SimklLocalReleaseDate[];
  users_recommendations: SimklMovieRecommendation[];
};

export type SimklMovie<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklMovieShort
  : T extends typeof SimklEntityType.Extended
    ? SimklMovieExtended
    : SimklMovieShort | SimklMovieExtended;

export type SimklMovieIdRequest = {
  /** Simkl ID or IMDB ID. */
  id: number | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklMovieTrendingRequest = {
  /** Filter within the time period. */
  interval?: SimklTrendingIntervals | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Discover>;

export type SimklMovieTrending = {
  title: string;
  url: string;
  poster: string;
  fanart: string;
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
  release_date: string;
  rank: number;
  drop_rate: string;
  watched: number;
  plan_to_watch: number;
  ratings: SimklRatings<'simkl' | 'imdb'>;
  country: string;
  runtime: string;
  status: SimklMovieStatuses;
  dvd_date: string;
  metadata: string;
  overview: string;
  genres: string[];
  theater: string;
};
