export enum HTTPStatus {
  OK = 200,
  Empty = 204,
  Redirect = 302,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  ServerError = 500
}

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete';

export type IDictionary<T> = {
  [key: string]: T
}

export enum LocalError {
  PAYMENT_REQUIRED = 'payment_required'
}