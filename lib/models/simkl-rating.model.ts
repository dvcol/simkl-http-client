import type { SimklCommonQuery, SimklEntityTypes } from '~/models/simkl-common.model';

export type SimklRatingScore = {
  rating: number;
  votes: number;
};

export type SimklRatingsBase = {
  simkl: SimklRatingScore;
  imdb?: SimklRatingScore;
  mal?: SimklRatingScore & { rank: number };
};

export type SimklRatingsExtended = SimklRatingsBase & {
  imdb?: SimklRatingScore;
  mal?: SimklRatingScore & { rank: number };
};

export type SimklRatings<K extends keyof T, T = SimklRatingsExtended> = Partial<SimklRatingsExtended> & {
  [P in K]: T[P];
};

export type SimklRating = {
  id: number;
  link: string;
  simkl: SimklRatingScore;
  imdb?: SimklRatingScore;
  rank: {
    type: SimklEntityTypes;
    value: number;
  };
  has_trailer: boolean;
};

export const SimklRatingField = {
  Rank: 'rank',
  DropRate: 'droprate',
  Simkl: 'simkl',
  External: 'ext',
  HasTrailer: 'has_trailer',
  All: ['rank', 'droprate', 'simkl', 'ext', 'has_trailer'] as const,
} as const;

export type SimklRatingFields = (typeof SimklRatingField)[keyof Omit<typeof SimklRatingField, 'All'>];

export type SimklRatingRequest = SimklCommonQuery & {
  fields: string | SimklRatingFields | SimklRatingFields[];
};
