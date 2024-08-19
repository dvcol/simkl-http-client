import type { SimklApiExtended, SimklApiParamsExtended, SimklApiParamsPagination } from '~/models/simkl-client.model';

import type {
  SimklAirDate,
  SimklAiringSorts,
  SimklAnimeAndShowStatuses,
  SimklBestFilters,
  SimklEntityType,
  SimklEntityTypes,
  SimklGenreSorts,
  SimklGenreYears,
  SimklIds,
  SimklMediaType,
  SimklPremiereDates,
  SimklPremiereParams,
  SimklTrailer,
  SimklTrendingIntervals,
} from '~/models/simkl-common.model';

import type { SimklEpisode, SimklEpisodeMinimal } from '~/models/simkl-episode.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

export const SimklAnimeType = {
  TV: 'tv',
  OVA: 'ova',
  ONA: 'ona',
  Movie: 'movie',
  Special: 'special',
  MusicVideo: 'music video',
} as const;

export type SimklAnimeTypes = (typeof SimklAnimeType)[keyof typeof SimklAnimeType];

export type SimklAnimeShort = {
  title: string;
  year: number;
  type: typeof SimklMediaType.Anime;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklAnimeAlternativeTitle = {
  name: string;
  lang: string;
  type: 'official' | 'synonym' | string;
};

export type SimklAnimeStudio = {
  id: number;
  name: string;
};

export type SimklAnimeRecommendation = {
  title: string;
  en_title?: string;
  year: number;
  poster: string;
  anime_type: SimklAnimeTypes;
  users_percent: number;
  users_count: number;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklAnimeRelation = {
  title: string;
  en_title?: string;
  year: number;
  poster: string;
  anime_type: SimklAnimeTypes;
  relation_type: string;
  is_direct: boolean;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklAnimeExtended = SimklAnimeShort & {
  year_start_end: string;
  en_title?: string;
  alt_titles?: SimklAnimeAlternativeTitle[];
  anime_type: SimklAnimeTypes;
  studios?: SimklAnimeStudio[];
  season_name_year?: string;
  rank: number;
  poster: string;
  fanart: string;
  first_aired: string;
  last_aired: string;
  airs: SimklAirDate;
  runtime: number;
  certification: string;
  overview: string;
  genres: string[];
  country: string;
  total_episodes: number;
  status: SimklAnimeAndShowStatuses;
  network: string;
  ratings?: SimklRatings<'simkl' | 'mal'>;
  trailer?: SimklTrailer[];
  user_recommendations?: SimklAnimeRecommendation[];
  relations?: SimklAnimeRelation[];
};

export type SimklAnime<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklAnimeShort
  : T extends typeof SimklEntityType.Extended
    ? SimklAnimeExtended
    : SimklAnimeShort & Partial<SimklAnimeExtended>;

export type SimklAnimeIdRequest = {
  /** Simkl ID or IMDB ID. */
  id: number | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklAnimeEpisodesRequest = {
  /** Simkl ID */
  id: number | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklAnimeEpisode<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = Omit<SimklEpisode<T>, 'season'>;

export type SimklAnimeTrendingRequest = {
  /** Filter within the time period. */
  interval?: SimklTrendingIntervals | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Discover>;

export type SimklAnimeTrendingShort = {
  poster: string;
  fanart: string;
  ids: SimklIds<'simkl_id'>;
  release_date: string;
  rank: number;
  drop_rate: string;
  watched: number;
  plan_to_watch: number;
  ratings: SimklRatings<'simkl' | 'mal'>;
  country: string;
  runtime: string;
  status: SimklAnimeAndShowStatuses;
  anime_type: SimklAnimeTypes;
  total_episodes: number;
  network: string;
};

export type SimklAnimeTrendingExtended = SimklAnimeTrendingShort & {
  title: string;
  url: string;
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
  metadata: string;
  overview: string;
  genres: string[];
};

export type SimklAnimeTrending<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklAnimeTrendingShort
  : T extends typeof SimklEntityType.Extended
    ? SimklAnimeTrendingExtended
    : SimklAnimeTrendingShort & Partial<SimklAnimeTrendingExtended>;

export const SimklAnimeGenreSection = {
  Action: 'action',
  Adventure: 'adventure',
  Cars: 'cars',
  Comedy: 'comedy',
  Dementia: 'dementia',
  Demons: 'demons',
  Drama: 'drama',
  Ecchi: 'ecchi',
  Fantasy: 'fantasy',
  Game: 'game',
  Harem: 'harem',
  Historical: 'historical',
  Horror: 'horror',
  Josei: 'josei',
  Kids: 'kids',
  Magic: 'magic',
  MartialArts: 'martial-arts',
  Mecha: 'mecha',
  Military: 'military',
  Music: 'music',
  Mystery: 'mystery',
  Parody: 'parody',
  Police: 'police',
  Psychological: 'psychological',
  Romance: 'romance',
  Samurai: 'samurai',
  School: 'school',
  SciFi: 'sci-fi',
  Seinen: 'seinen',
  Shoujo: 'shoujo',
  ShoujoAi: 'shoujo-ai',
  Shounen: 'shounen',
  ShounenAi: 'shounen-ai',
  SliceOfLife: 'slice-of-life',
  Space: 'space',
  Sports: 'sports',
  SuperPower: 'super-power',
  Supernatural: 'supernatural',
  Thriller: 'thriller',
  Vampire: 'vampire',
  Yaoi: 'yaoi',
  Yuri: 'yuri',
  All: 'all',
} as const;

export type SimklAnimeGenreSections = (typeof SimklAnimeGenreSection)[keyof typeof SimklAnimeGenreSection];

export const SimklAnimeGenreType = {
  All: 'all-types',
  Series: 'series',
  Movies: 'movies',
  OVAs: 'ovas',
  ONAs: 'onas',
} as const;

export type SimklAnimeGenreTypes = (typeof SimklAnimeGenreType)[keyof typeof SimklAnimeGenreType];

export const SimklAnimeGenreNetwork = {
  All: 'all',
  TVTokyo: 'tvtokyo',
  TokyoMX: 'tokyomx',
  FujiTV: 'fujitv',
  TokyoBroadcastingSystem: 'tokyobroadcastingsystem',
  TVAsahi: 'tvasahi',
  WOWOW: 'wowow',
  NTV: 'ntv',
  ATX: 'atx',
  CTC: 'ctc',
  NHK: 'nhk',
  MBS: 'mbs',
  Animax: 'animax',
  CartoonNetwork: 'cartoonnetwork',
  ABC: 'abc',
} as const;

export type SimklAnimeGenreNetworks = (typeof SimklAnimeGenreNetwork)[keyof typeof SimklAnimeGenreNetwork];

export type SimklAnimeGenreRequest = {
  /** Default is all. */
  genre?: SimklAnimeGenreSections | string;
  /** Default is all-types. */
  type?: SimklAnimeGenreTypes | string;
  /** Default: all-networks (empty) */
  network?: SimklAnimeGenreNetworks | string;
  /** Default: 2010s */
  year?: SimklGenreYears | string;
  /** Default: rank */
  sort?: SimklGenreSorts | string;
} & SimklApiParamsPagination;

export type SimklAnimeGenre = {
  title: string;
  year: number;
  date: string;
  url: string;
  poster: string;
  fanart: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  anime_type: SimklAnimeTypes;
  rank: number;
  ratings: SimklRatings<'simkl' | 'mal'>;
};

export const SimklAnimePremiereType = {
  All: 'all',
  Series: 'series',
  Movies: 'movies',
  OVAs: 'ovas',
} as const;

export type SimklAnimePremiereTypes = (typeof SimklAnimePremiereType)[keyof typeof SimklAnimePremiereType];

export type SimklAnimePremieresRequest = {
  param: SimklPremiereParams | string;
  type?: SimklAnimePremiereTypes | string;
} & SimklApiParamsPagination;

export type SimklAnimePremiere = {
  title: string;
  year: number;
  date: string;
  poster: string;
  url: string;
  rank?: number;
  anime_type: SimklAnimeTypes;
  ids: SimklIds<'simkl_id' | 'slug'>;
  ratings?: SimklRatings<'simkl' | 'mal'>;
};

export type SimklAnimeAiringRequest = {
  date?: SimklPremiereDates | string;
  sort?: SimklAiringSorts | string;
};

export type SimklAnimeAiring = {
  title: string;
  year: number;
  date: string;
  poster: string;
  url: string;
  rank?: number;
  anime_type: SimklAnimeTypes;
  ids: SimklIds<'simkl_id' | 'slug'>;
  episode: Omit<SimklEpisodeMinimal, 'season'>;
};

export const SimklAnimeBestType = {
  All: 'all',
  TV: 'tv',
  Movies: 'movies',
  Music: 'music',
  OVAs: 'ovas',
  ONAs: 'onas',
} as const;

export type SimklAnimeBestTypes = (typeof SimklAnimeBestType)[keyof typeof SimklAnimeBestType];

export type SimklAnimeBestRequest = {
  filter: SimklBestFilters | string;
  type?: SimklAnimeBestTypes | string;
};

export type SimklAnimeBest = {
  title: string;
  year: number;
  poster: string;
  url: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  ratings: SimklRatings<'simkl' | 'mal'>;
};
