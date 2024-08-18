import { authentication } from '~/api/endpoints/authentication.endpoint';
import { calendar } from '~/api/endpoints/calendar.endpoint';
import { checkin } from '~/api/endpoints/checkin.endpoint';
import { ratings } from '~/api/endpoints/ratings.endpoint';
import { redirect } from '~/api/endpoints/redirect.endpoint';
import { search } from '~/api/endpoints/search.endpoint';

export const simklApi = {
  authentication,
  calendar,
  checkin,
  ratings,
  redirect,
  search,
};

export type SimklApi = typeof simklApi;
