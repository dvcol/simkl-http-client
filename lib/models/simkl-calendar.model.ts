import type { SimklAnimeShort, SimklAnimeTypes } from '~/models/simkl-anime.model';

import type { SimklEntityType, SimklMediaType, SimklMediaTypes } from '~/models/simkl-common.model';
import type { SimklCalendarEpisode } from '~/models/simkl-episode.model';

import type { SimklMovieShort } from '~/models/simkl-movie.model';
import type { SimklRatings } from '~/models/simkl-rating.model';

import type { SimklShowShort } from '~/models/simkl-show.model';

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
  ratings: SimklRatings;
  url: string;
};

export type SimklCalendarMovie = SimklCalendarEntity & {
  ids: SimklMovieShort['ids'];
};

export type SimklCalendarShow = SimklCalendarEntity & {
  ids: SimklShowShort['ids'];
  episode: SimklCalendarEpisode;
};

export type SimklCalendarAnime = SimklCalendarEntity & {
  ids: SimklAnimeShort['ids'];
  episode: Omit<SimklCalendarEpisode, 'season'>;
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
