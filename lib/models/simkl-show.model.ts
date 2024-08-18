import type { SimklEntityType, SimklEntityTypes, SimklIds, SimklMediaType } from '~/models/simkl-common.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

export type SimklShowShort = {
  title: string;
  year: number;
  type: typeof SimklMediaType.Show;
  ids: Pick<SimklIds, 'simkl_id' | 'slug' | 'tmdb' | 'imdb'>;
};

export type SimklShowAirDate = {
  day: string;
  time: string;
  timezone: string;
};

export type SimklShowExtended = SimklShowShort & {
  rank: number;
  poster: string;
  fanart: string;
  first_aired: string;
  airs: SimklShowAirDate;
  runtime: number;
  certification: string;
  overview: string;
  genres: string[];
  country: string;
  total_episodes: number;
  status: string;
  network: string;
  ratings: SimklRatings;
  trailer?: string;
};

export type SimklShow<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends 'short'
  ? SimklShowShort
  : T extends 'extended'
    ? SimklShowExtended
    : SimklShowShort & Partial<SimklShowExtended>;
