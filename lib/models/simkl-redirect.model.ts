import type { SimklCommonQuery } from '~/models/simkl-common.model';

export const SimklRedirectTo = {
  Simkl: 'Simkl',
  Trailer: 'trailer',
  Twitter: 'twitter',
} as const;

export type SimklRedirectTos = (typeof SimklRedirectTo)[keyof typeof SimklRedirectTo];

export type SimklRedirectRequest = SimklCommonQuery & {
  /** can be "Simkl" "trailer" or "twitter" */
  to: SimklRedirectTos;
};

export type SimklRedirectWatchedRequest = SimklCommonQuery & {
  /** Must be "watched" */
  to?: 'watched';
  /** The client ID you received from Simkl when you registered your application. */
  client_id?: string;
};
