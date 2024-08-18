import type { SimklCommonQuery, SimklEntityTypes } from '~/models/simkl-common.model';

export type SimklRatingScore = {
  rating: number;
  votes: number;
};

export type SimklRatings = {
  simkl: SimklRatingScore;
  imdb?: SimklRatingScore;
  mal?: SimklRatingScore & { rank: number };
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
