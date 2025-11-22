import { AxiosError, type AxiosResponse } from 'axios';

// Creates appropriate error instance based on HTTP status code
export function handleError(
  error: AxiosError<{ status: number; errors?: object; message?: string }>
): Error {
  let message: string = error.message || 'Something wrong';
  if (error.response) {
    // The request was made and the server responded with a status code
    message += ' ' + error.response.statusText;

    if (error.response.status === 0) {
      return new ConnectionError(error);
    }
    if (error.response.status === 400 || error.response.status === 422) {
      if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.errors) {
        const [key, value] = Object.entries(error.response.data.errors)[0];
        message = key ? `Error in ${key}: ${value}` : message;
      }
      return new ValidationError(message, error);
    }
    if (error.response.status === 401) {
      return new UnauthorizedError(message, error);
    }
    if (error.response.status === 403) {
      return new ForbiddenError(message, error);
    }
    if (error.response.status === 404) {
      return new NotFoundError(message, error);
    }
    if (error.response.status === 500) {
      return new InternalError(message, error);
    }
    return new ApiError('ApiError', message, error.response.status, error);
  }
  if (error.request) {
    // The request was made but no response was received
    return new ConnectionError(error);
  }
  // Something happened in setting up the request
  console.log('Unexpected Error', error);
  return new Error('Unknown error');
}

// Base API error
export class ApiError extends Error {
  public name: string;
  public message: string;
  // HTTP status code
  public status: number;
  public code?: string;
  public metadata: {
    response?: Partial<AxiosResponse>;
    config?: AxiosError['config'];
  };

  public constructor(
    name: string,
    message: string,
    status: number,
    error: AxiosError
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = name;
    this.message = message;
    this.status = status;
    this.code = error.code;
    this.metadata = { response: error.response, config: error.config };
  }
}

export class ValidationError extends ApiError {
  public constructor(message: string, error: AxiosError) {
    super('ValidationError', message, 422, error);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  public constructor(message: string, error: AxiosError) {
    super('UnauthorizedError', message, 401, error);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends ApiError {
  public constructor(message: string, error: AxiosError) {
    super('ForbiddenError', message, 403, error);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends ApiError {
  public constructor(message: string, error: AxiosError) {
    super('NotFoundError', message, 404, error);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalError extends ApiError {
  public constructor(message: string, error: AxiosError) {
    super('InternalError', message, 500, error);
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

export class ConnectionError extends ApiError {
  public constructor(error: AxiosError) {
    super('ConnectionError', 'API server not reachable', 0, error);
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

export const handleAxiosError = (error: any) =>
  Promise.reject(handleError(error));
