import type { SimklMovieShort } from '~/models/simkl-movie.model';

import type { SimklShowShort } from '~/models/simkl-show.model';

/**
 * Type show combine tv and anime types.
 */
export type SimklCheckinRequest = {
  movie?: Partial<SimklMovieShort> & Required<Pick<SimklMovieShort, 'ids'>>;
  show?: Partial<SimklShowShort> &
    Required<Pick<SimklShowShort, 'ids'>> & {
      episode: {
        season: number;
        number: number;
      };
    };
};

export type SimklCheckinInProgress = {
  expires_at?: string;
};
