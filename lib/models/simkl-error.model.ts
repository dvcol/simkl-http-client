import type { SimklApiResponse } from '~/models/simkl-client.model';

export const SimklErrorTypes = {
  SimklApiError: 'SimklApiError',
  SimklRateLimitError: 'SimklRateLimitError',
  SimklInvalidCsrfError: 'SimklInvalidCsrfError',
  SimklUnauthorizedError: 'SimklUnauthorizedError',
  SimklPollingExpiredError: 'SimklPollingExpiredError',
  SimklPollingCancelledError: 'SimklPollingCancelledError',
  SimklInvalidParameterError: 'SimklInvalidParameterError',
} as const;

export class SimklApiError<T = unknown> extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | SimklApiResponse<T>;

  constructor(message: string, error?: Error | SimklApiResponse<T>) {
    super(message);
    this.name = SimklErrorTypes.SimklApiError;
    this.error = error;
  }
}

export class SimklInvalidParameterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = SimklErrorTypes.SimklInvalidParameterError;
  }
}

export class SimklPollingExpiredError extends Error {
  constructor(message: string = 'Polling expired.') {
    super(message);
    this.name = SimklErrorTypes.SimklPollingExpiredError;
  }
}

export class SimklPollingCancelledError extends Error {
  constructor(message: string = 'Polling cancelled.') {
    super(message);
    this.name = SimklErrorTypes.SimklPollingCancelledError;
  }
}

export class SimklUnauthorizedError<T = unknown> extends SimklApiError<T> {
  constructor(message?: string, error?: Error | SimklApiResponse<T>) {
    super(message, error);
    this.name = SimklErrorTypes.SimklUnauthorizedError;
  }
}

export class SimklRateLimitError<T = unknown> extends SimklApiError<T> {
  constructor(message?: string, error?: Error | SimklApiResponse<T>) {
    super(message, error);
    this.name = SimklErrorTypes.SimklRateLimitError;
  }
}

export class SimklInvalidCsrfError extends Error {
  readonly state?: string;
  readonly expected?: string;
  constructor({ state, expected }: { state?: string; expected?: string } = {}) {
    super(`Invalid CSRF (State): expected '${expected}', but received ${state}`);
    this.name = SimklErrorTypes.SimklInvalidCsrfError;
    this.state = state;
    this.expected = expected;
  }
}
