import { ApiError, InvalidCsrfError, InvalidParameterError, PollingExpiredError } from '@dvcol/base-http-client/utils/error';

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

export class SimklApiError<T = unknown> extends ApiError<SimklApiResponse<T>> {
  constructor(message: string, error?: Error | SimklApiResponse<T>) {
    super(message, error);
    this.name = SimklErrorTypes.SimklApiError;
  }
}

export class SimklInvalidParameterError extends InvalidParameterError {
  constructor(message?: string) {
    super(message);
    this.name = SimklErrorTypes.SimklInvalidParameterError;
  }
}

export class SimklPollingExpiredError extends PollingExpiredError {
  constructor(message?: string) {
    super(message);
    this.name = SimklErrorTypes.SimklPollingExpiredError;
  }
}

export class SimklPollingCancelledError extends Error {
  constructor(message?: string) {
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

export class SimklInvalidCsrfError extends InvalidCsrfError {
  constructor({ state, expected }: { state?: string; expected?: string } = {}) {
    super({ state, expected });
    this.name = SimklErrorTypes.SimklInvalidCsrfError;
  }
}
