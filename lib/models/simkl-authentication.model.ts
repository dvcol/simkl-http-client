export type SimklAuthenticationAuthorizeRequest = {
  /** The client ID you received from Simkl when you registered your application. */
  client_id: string;
  /** The URL in your app where users will be sent after authorization. */
  redirect_uri: string;
  /** Must be 'code' */
  response_type?: 'code';
  /** An optional parameter to protect against CSRF attacks. */
  state?: string;
};

export type SimklAuthorizeQuery = Partial<Omit<SimklAuthenticationAuthorizeRequest, 'client_id' | 'response_type'>> & {
  redirect?: RequestRedirect;
};

export type SimklAuthenticationTokenRequest = {
  /** The authorization code you received from the authorization endpoint. */
  code: string;
  /** The client ID you received from Simkl when you registered your application. */
  client_id: string;
  /** The client secret you received from Simkl when you registered your application. */
  client_secret: string;
  /** The URL sent in the initial request to the authorization endpoint. */
  redirect_uri: string;
  /** Must be 'authorization_code' */
  grant_type?: 'authorization_code';
};

export type SimklTokenExchangeQuery = Partial<Omit<SimklAuthenticationTokenRequest, 'client_id' | 'client_secret' | 'grant_type'>>;

export type SimklAuthenticationToken = {
  access_token: string;
  token_type: 'bearer';
  scope: 'public';
};

export type SimklAuthenticationPinCodeRequest = {
  /** The client ID you received from Simkl when you registered your application. */
  client_id: string;
  /** The URL in your app where users will be sent after authorization. */
  redirect?: string;
};

export type SimklAuthenticationCode = {
  result: 'OK' | 'KO';
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
};

export type SimklAuthenticationCodeStatusRequest = {
  /** The client ID you received from Simkl when you registered your application. */
  client_id: string;
  /** The device code you received from the pin code authorization endpoint. */
  user_code: string;
};

export const SimklPollingStatus = {
  Pending: 'Authorization pending',
  SlowDown: 'Slow down',
} as const;

export const SimklPollingResult = {
  OK: 'OK',
  KO: 'KO',
} as const;

export type SimklPollingStatuses = (typeof SimklPollingStatus)[keyof typeof SimklPollingStatus];

export type SimklAuthenticationCodeStatus = {
  result: typeof SimklPollingResult.KO;
  message: string | SimklPollingStatuses;
};

export type SimklAuthenticationCodeToken = {
  result: typeof SimklPollingResult.OK;
  access_token: string;
};

export type SimklAuthenticationCodeStatusResponse = SimklAuthenticationCodeStatus | SimklAuthenticationCodeToken;
