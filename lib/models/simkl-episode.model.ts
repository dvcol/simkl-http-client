import type { SimklEntityType, SimklEntityTypes, SimklIds } from '~/models/simkl-common.model';

export type SimklEpisodeMinimal = {
  season: number;
  episode: number;
  url: string;
};

export type SimklEpisodeShort = {
  season: number;
  episode: number;
  type: 'episode';
  aired: boolean;
  img: string;
  date: string;
  ids: SimklIds<'simkl_id'>;
};

export type SimklEpisodeExtended = SimklEpisodeShort & {
  title: string;
  description: string;
};

export type SimklEpisode<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklEpisodeShort
  : T extends typeof SimklEntityType.Extended
    ? SimklEpisodeExtended
    : SimklEpisodeShort & Partial<SimklEpisodeExtended>;
