import { authentication } from '~/api/endpoints/authentication.endpoint';

export const simklApi = {
  authentication,
};

export type SimklApi = typeof simklApi;
