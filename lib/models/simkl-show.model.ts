import type { SimklApiExtended, SimklApiParamsExtended, SimklApiParamsPagination } from '~/models/simkl-client.model';

import type {
  SimklAirDate,
  SimklAnimeAndShowStatuses,
  SimklEntityType,
  SimklEntityTypes,
  SimklIds,
  SimklMediaType,
  SimklTrailer,
} from '~/models/simkl-common.model';
import type { SimklEpisodeMinimal } from '~/models/simkl-episode.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

export type SimklShowShort = {
  title: string;
  year: number;
  type: typeof SimklMediaType.Show;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklShowRecommendation = {
  title: string;
  year: number;
  poster: string;
  users_percent: number;
  users_count: number;
  ids: SimklIds<'slug' | 'simkl'>;
};

export type SimklShowExtended = SimklShowShort & {
  year_start_end: string;
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
  ratings: SimklRatings<'simkl' | 'imdb'>;
  trailer?: SimklTrailer[];
  user_recommendations?: SimklShowRecommendation[];
};

export type SimklShow<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklShowShort
  : T extends typeof SimklEntityType.Extended
    ? SimklShowExtended
    : SimklShowShort & Partial<SimklShowExtended>;

export type SimklShowIdRequest = {
  /** Simkl ID or IMDB ID. */
  id: number | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export type SimklShowEpisodesRequest = {
  /** Simkl ID */
  id: number | string;
} & SimklApiParamsExtended<typeof SimklApiExtended.Full>;

export const SimklShowTrendingInterval = {
  Today: 'today',
  Week: 'week',
  Month: 'month',
} as const;

export type SimklShowTrendingIntervals = (typeof SimklShowTrendingInterval)[keyof typeof SimklShowTrendingInterval];

export type SimklShowTrendingRequest = {
  /** Filter within the time period. */
  interval?: SimklShowTrendingIntervals;
} & SimklApiParamsExtended<typeof SimklApiExtended.Discover>;

export type SimklShowTrendingShort = {
  poster: string;
  fanart: string;
  ids: SimklIds<'simkl_id'>;
  release_date: string;
  rank: number;
  drop_rate: string;
  watched: number;
  plan_to_watch: number;
  ratings: SimklRatings<'simkl' | 'imdb'>;
  country: string;
  runtime: string;
  status: SimklAnimeAndShowStatuses;
  total_episodes: number;
  network: string;
};

export type SimklShowTrendingExtended = SimklShowTrendingShort & {
  title?: string;
  url?: string;
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb'>;
  metadata?: string;
  overview?: string;
  genres?: string[];
};

export type SimklShowTrending<T extends SimklEntityTypes = typeof SimklEntityType.Unknown> = T extends typeof SimklEntityType.Short
  ? SimklShowTrendingShort
  : T extends typeof SimklEntityType.Extended
    ? SimklShowTrendingExtended
    : SimklShowTrendingShort & Partial<SimklShowTrendingExtended>;

export const SimklShowGenreSection = {
  Action: 'action',
  Adventure: 'adventure',
  Animation: 'animation',
  AwardsShow: 'awards-show',
  Children: 'children',
  Comedy: 'comedy',
  Crime: 'crime',
  Documentary: 'documentary',
  Drama: 'drama',
  Family: 'family',
  Fantasy: 'fantasy',
  Food: 'food',
  GameShow: 'game-show',
  History: 'history',
  HomeAndGarden: 'home-and-garden',
  Horror: 'horror',
  Indie: 'indie',
  MartialArts: 'martial-arts',
  MiniSeries: 'mini-series',
  Musical: 'musical',
  Mystery: 'mystery',
  News: 'news',
  Podcast: 'podcast',
  Reality: 'reality',
  Romance: 'romance',
  ScienceFiction: 'science-fiction',
  Soap: 'soap',
  SpecialInterest: 'special-interest',
  Sport: 'sport',
  Suspense: 'suspense',
  TalkShow: 'talk-show',
  Thriller: 'thriller',
  Travel: 'travel',
  War: 'war',
  Western: 'western',
  All: 'all',
} as const;

export type SimklShowGenreSections = (typeof SimklShowGenreSection)[keyof typeof SimklShowGenreSection];

export const SimklShowGenreType = {
  All: 'all-types',
  Entertainment: 'entertainment',
  Documentaries: 'documentaries',
  Animation: 'animation-filter',
} as const;

export type SimklShowGenreTypes = (typeof SimklShowGenreType)[keyof typeof SimklShowGenreType];

export const SimklShowGenreCountry = {
  All: 'all-countries',
  US: 'us',
  UK: 'uk',
  CA: 'ca',
  KR: 'kr',
  JP: 'jp',
} as const;

export type SimklShowGenreCountries = (typeof SimklShowGenreCountry)[keyof typeof SimklShowGenreCountry];

export const SimklShowGenreNetwork = {
  Netflix: 'netflix',
  Disney: 'disney',
  Peacock: 'peacock',
  AppleTV: 'appletv',
  Quibi: 'quibi',
  CBS: 'cbs',
  ABC: 'abc',
  FOX: 'fox',
  CW: 'cw',
  HBO: 'hbo',
  Showtime: 'showtime',
  USA: 'usa',
  Syfy: 'syfy',
  TNT: 'tnt',
  FX: 'fx',
  AMC: 'amc',
  ABCFAM: 'abcfam',
  Showcase: 'showcase',
  Starz: 'starz',
  MTV: 'mtv',
  Lifetime: 'lifetime',
  AE: 'ae',
  TVLand: 'tvland',
} as const;

export type SimklShowGenreNetworks = (typeof SimklShowGenreNetwork)[keyof typeof SimklShowGenreNetwork];

export const SimklShowGenreYear = {
  All: 'all-years',
  Today: 'today',
  ThisWeek: 'this-week',
  ThisMonth: 'this-month',
  ThisYear: 'this-year',
} as const;

export type SimklShowGenreYears = (typeof SimklShowGenreYear)[keyof typeof SimklShowGenreYear];

export const SimklShowGenreSort = {
  PopularToday: 'popular-today',
  PopularThisWeek: 'popular-this-week',
  PopularThisMonth: 'popular-this-month',
  Rank: 'rank',
  Votes: 'votes',
  ReleaseDate: 'release-date',
  LastAirDate: 'last-air-date',
  AlphabetAZ: 'a-z',
  AlphabetZA: 'z-a',
} as const;

export type SimklShowGenreSorts = (typeof SimklShowGenreSort)[keyof typeof SimklShowGenreSort];

export type SimklShowGenreRequest = {
  /** Default: all */
  genre?: SimklShowGenreSections | string;
  /** Default: tv-shows (empty) */
  type?: SimklShowGenreTypes | string;
  /** Default: us */
  country?: SimklShowGenreCountries | string;
  /** Default: all-networks (empty) */
  network?: SimklShowGenreNetworks | string;
  /** Default: 2010s */
  year?: SimklShowGenreYears | string;
  /** Default: rank */
  sort?: SimklShowGenreSorts | string;
} & SimklApiParamsPagination;

export type SimklShowGenre = {
  title: string;
  year: number;
  date: string;
  url: string;
  poster: string;
  fanart: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  rank: number;
  ratings: SimklRatings<'simkl' | 'imdb'>;
};

export const SimklShowPremiereParam = {
  New: 'new',
  Soon: 'soon',
} as const;

export type SimklShowPremiereParams = (typeof SimklShowPremiereParam)[keyof typeof SimklShowPremiereParam];

export const SimklShowPremiereType = {
  All: 'all',
  Entertainment: 'entertainment',
  Documentaries: 'documentaries',
  Animation: 'animation-filter',
} as const;

export type SimklShowPremiereTypes = (typeof SimklShowPremiereType)[keyof typeof SimklShowPremiereType];

export type SimklShowPremieresRequest = {
  param: SimklShowPremiereParams | string;
  type?: SimklShowPremiereTypes | string;
} & SimklApiParamsPagination;

export type SimklShowPremiere = {
  title: string;
  year: number;
  date: string;
  url: string;
  poster: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  rank?: number;
  ratings?: SimklRatings<'simkl' | 'imdb'>;
};

export const SimklShowPremiereDate = {
  Today: 'today',
  Tomorrow: 'tomorrow',
} as const;

export type SimklShowPremiereDates = (typeof SimklShowPremiereDate)[keyof typeof SimklShowPremiereDate];

export const SimklShowAiringSort = {
  Time: 'time',
  Rank: 'rank',
  Popularity: 'popularity',
} as const;

export type SimklShowAiringSorts = (typeof SimklShowAiringSort)[keyof typeof SimklShowAiringSort];

export type SimklShowAiringRequest = {
  date?: SimklShowPremiereDates | string;
  sort?: SimklShowAiringSorts | string;
};

export type SimklShowAiring = {
  title: string;
  year: number;
  date: string;
  poster: string;
  rank?: number;
  url: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  episode: SimklEpisodeMinimal;
};

export const SimklShowBestFilter = {
  Year: 'year',
  Month: 'month',
  All: 'all',
  Voted: 'voted',
  Watched: 'watched',
} as const;

export type SimklShowBestFilters = (typeof SimklShowBestFilter)[keyof typeof SimklShowBestFilter];

export const SimklShowBestType = {
  Series: 'series',
  Documentary: 'documentary',
  Entertainment: 'entertainment',
  Animation: 'animation',
} as const;

export type SimklShowBestTypes = (typeof SimklShowBestType)[keyof typeof SimklShowBestType];

export type SimklShowBestRequest = {
  filter: SimklShowBestFilters | string;
  type?: SimklShowBestTypes | string;
};

export type SimklShowBest = {
  title: string;
  year: number;
  poster: string;
  url: string;
  ids: SimklIds<'simkl_id' | 'slug'>;
  ratings: SimklRatings<'simkl' | 'imdb'>;
};
