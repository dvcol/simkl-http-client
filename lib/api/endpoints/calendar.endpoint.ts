import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklCalendarAnime, SimklCalendarMonthRequest, SimklCalendarMovie, SimklCalendarShow, SimklMonth } from '~/models/simkl-calendar.model';

import { Config } from '~/config';
import { SimklClientEndpoint } from '~/models';

/**
 * Simkl provides separate JSON data calendar files that can be used to display the "Upcoming", "Next", "Schedule" or "Calendar" sections in your app or within show details cards.
 * The calendar files are generated every 6 hours and are cached on a CDN for 5 hours (you can check the last-modified HTTP Headers for the file generation date).
 *
 * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
 */
export const calendar = {
  shows: {
    /**
     * Get the next 33 days of TV show releases.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    next: new SimklClientEndpoint<Record<string, never>, SimklCalendarShow[]>({
      method: HttpMethod.GET,
      url: '/calendar/tv.json',
      opts: {
        endpoint: Config.Data,
      },
    }),
    /**
     * Calendars are updated for the past 12 months every 24 hours, and for the current month every 6 hours.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    month: new SimklClientEndpoint<SimklCalendarMonthRequest, SimklCalendarShow[]>({
      method: HttpMethod.GET,
      url: '/calendar/:year/:month/tv.json',
      seed: {
        year: new Date().getFullYear(),
        month: (new Date().getMonth() + 1) as SimklMonth,
      },
      opts: {
        endpoint: Config.Data,
        parameters: {
          path: {
            year: true,
            month: true,
          },
        },
      },
    }),
  },
  anime: {
    /**
     * Get the next 33 days of anime releases.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    next: new SimklClientEndpoint<Record<string, never>, SimklCalendarAnime[]>({
      method: HttpMethod.GET,
      url: '/calendar/anime.json',
      opts: {
        endpoint: Config.Data,
      },
    }),
    /**
     * Calendars are updated for the past 12 months every 24 hours, and for the current month every 6 hours.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    month: new SimklClientEndpoint<SimklCalendarMonthRequest, SimklCalendarAnime[]>({
      method: HttpMethod.GET,
      url: '/calendar/:year/:month/anime.json',
      seed: {
        year: new Date().getFullYear(),
        month: (new Date().getMonth() + 1) as SimklMonth,
      },
      opts: {
        endpoint: Config.Data,
        parameters: {
          path: {
            year: true,
            month: true,
          },
        },
      },
    }),
  },
  movies: {
    /**
     * Get the next 33 days of movie releases.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    next: new SimklClientEndpoint<Record<string, never>, SimklCalendarMovie[]>({
      method: HttpMethod.GET,
      url: '/calendar/movie_release.json',
      opts: {
        endpoint: Config.Data,
      },
    }),
    /**
     * Calendars are updated for the past 12 months every 24 hours, and for the current month every 6 hours.
     *
     * @see [documentation]{@link https://simkl.docs.apiary.io/#reference/calendar/authorize-application}
     */
    month: new SimklClientEndpoint<SimklCalendarMonthRequest, SimklCalendarMovie[]>({
      method: HttpMethod.GET,
      url: '/calendar/:year/:month/movie_release.json',
      seed: {
        year: new Date().getFullYear(),
        month: (new Date().getMonth() + 1) as SimklMonth,
      },
      opts: {
        endpoint: Config.Data,
        parameters: {
          path: {
            year: true,
            month: true,
          },
        },
      },
    }),
  },
};
