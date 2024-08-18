import type { SimklClientSettings } from '~/models/simkl-client.model';

import { Config } from '~/config';

export const simklClientSettingsMock: SimklClientSettings = {
  client_id: 'my-client-id',
  client_secret: 'my-client-secret',
  redirect_uri: 'my-redirect-uri',

  endpoint: Config.Endpoint,

  useragent: 'my-user-agent',
};
