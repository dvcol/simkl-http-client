import { HttpMethod } from '@dvcol/common-utils/http';

import type { SimklCheckinRequest } from '~/models/simkl-checkin.model';

import { SimklApiAuthType, SimklClientEndpoint } from '~/models/simkl-client.model';

/**
 * Check into an item
 *
 * This should be tied to a user manual action.
 *
 * The item will be as watching on the site and if the time has elapsed it will switch to completed.
 *
 * If you wish to instantly mark episode\movie as watched please use [Sync, Add to History method]{@link https://simkl.docs.apiary.io/#reference/sync/add-to-history/check-into-an-item}
 *
 * * Note: If there is checkin in progress, 409 code will be returned and response will contain an expires_at datetime when you will be able to ckeckin again {@link SimklCheckinInProgress}.
 *
 * @auth user
 *
 * @see [checkin]{@link https://simkl.docs.apiary.io/reference/checkin}
 */
export const checkin = new SimklClientEndpoint<SimklCheckinRequest, SimklCheckinRequest, false>({
  method: HttpMethod.POST,
  url: '/checkin',
  body: {
    movie: false,
    show: false,
  },
  opts: {
    cache: false,
    auth: SimklApiAuthType.User,
  },
});
