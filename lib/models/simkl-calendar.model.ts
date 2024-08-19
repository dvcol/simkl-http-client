import type { SimklAnimeTypes } from '~/models/simkl-anime.model';

import type { SimklEntityType, SimklIds, SimklMediaType, SimklMediaTypes } from '~/models/simkl-common.model';
import type { SimklEpisodeMinimal } from '~/models/simkl-episode.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

export type SimklMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SimklCalendarMonthRequest = {
  year?: string | number;
  month?: string | SimklMonth;
};

export type SimklCalendarEntity = {
  title: string;
  poster?: string;
  date: string;
  release_date: string;
  rank: number;
  url: string;
};

export type SimklCalendarMovie = SimklCalendarEntity & {
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb' | 'imdb'>;
  ratings: SimklRatings<'simkl'>;
};

export type SimklCalendarShow = SimklCalendarEntity & {
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb' | 'imdb'>;
  episode: SimklEpisodeMinimal;
  ratings: SimklRatings<'simkl'>;
};

export type SimklCalendarAnime = SimklCalendarEntity & {
  ids: SimklIds<'simkl_id' | 'slug' | 'tmdb' | 'mal'>;
  episode: Omit<SimklEpisodeMinimal, 'season'>;
  ratings: SimklRatings<'simkl'>;
  anime_type: SimklAnimeTypes;
};

export type SimklCalendar<T extends SimklMediaTypes | typeof SimklEntityType.Unknown = typeof SimklEntityType.Unknown> =
  T extends typeof SimklMediaType.Movie
    ? SimklCalendarMovie
    : T extends typeof SimklMediaType.Show
      ? SimklCalendarShow
      : T extends typeof SimklMediaType.Anime
        ? SimklCalendarAnime
        : SimklCalendarMovie | SimklCalendarShow | SimklCalendarAnime;
