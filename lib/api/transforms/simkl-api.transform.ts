import type { SimklApiExtends, SimklApiParams } from '~/models';

import { SimklApiDiscoverExtended, SimklApiExtended } from '~/models';

export const SimklApiTransform = {
  Extends: {
    [SimklApiExtended.Full]: params => {
      if (params.extended !== undefined && typeof params.extended === 'boolean') {
        return { ...params, extended: params.extended ? SimklApiExtended.Full : undefined };
      }
      return params;
    },
    [SimklApiExtended.Discover]: params => {
      if (params.extended && Array.isArray(params.extended)) {
        return { ...params, extended: params.extended.join(',') };
      }
      if (params.extended !== undefined && typeof params.extended === 'boolean') {
        return { ...params, extended: params.extended ? SimklApiDiscoverExtended.All.join(',') : undefined };
      }
      return params;
    },
  } as Record<SimklApiExtends, <P extends SimklApiParams>(param: P) => P>,
};
