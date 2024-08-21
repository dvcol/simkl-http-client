import { anime } from '~/api/endpoints/anime.endpoint';
import { authentication } from '~/api/endpoints/authentication.endpoint';
import { calendar } from '~/api/endpoints/calendar.endpoint';
import { checkin } from '~/api/endpoints/checkin.endpoint';
import { movie } from '~/api/endpoints/movie.endpoint';
import { ratings } from '~/api/endpoints/ratings.endpoint';
import { redirect } from '~/api/endpoints/redirect.endpoint';
import { search } from '~/api/endpoints/search.endpoint';
import { show } from '~/api/endpoints/show.endpoint';
import { sync } from '~/api/endpoints/sync.endpoint';
import { user } from '~/api/endpoints/user.endpoint';

export const simklApi = {
  authentication,
  calendar,
  checkin,
  ratings,
  redirect,
  search,
  show,
  anime,
  movie,
  sync,
  user,
};

export type SimklApi = typeof simklApi;
