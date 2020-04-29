import * as RateLimiter from 'rate-limiter-flexible';
import { databaseUri, generalMgOptions } from '../db';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Logger } from 'server/logger';
import mongoose from 'mongoose';
import { HTTPStatus } from '../models';
import moment from 'moment';

const connectStore = mongoose.createConnection(databaseUri, generalMgOptions);
const opts = {
  storeClient: connectStore,
  keyPrefix: 'bruteForce',
};

const rateLimiterMongo = new RateLimiter.RateLimiterMongo({
  ...opts,
  points: 10, // Number of points
  duration: 60, // Per second(s)
});

const fetchingLimiter = new RateLimiter.RateLimiterMongo({
  ...opts,
  points: 2, // Number of points
  duration: 1, // Per second(s)
  keyPrefix: 'fetchForce',
});
const mailerLimiter = new RateLimiter.RateLimiterMongo({
  ...opts,
  points: 1, // Number of points
  duration: 86400, // Per day
  keyPrefix: 'mailForce',
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let limiter: RateLimiter.RateLimiterMongo = null;
  limiter = rateLimiterMongo;

  return limiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch((rateLimiterRes) => {
      const error = `You've made too many failed attempts in a short period of time, please try again at ${moment()
        .add(rateLimiterRes.msBeforeNext, 'milliseconds')
        .format()}`;
      return res.status(HTTPStatus.TooManyRequests).send({ error });
    });
};
export const messageLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let limiter: RateLimiter.RateLimiterMongo = null;
  limiter = mailerLimiter;

  return limiter
    .consume(req.body?.email ?? req.ip)
    .then(() => {
      next();
    })
    .catch((rateLimiterRes) => {
      const error = `You've already sent message, please try again at ${moment()
        .add(rateLimiterRes.msBeforeNext, 'milliseconds')
        .format()}`;
      return res.status(HTTPStatus.TooManyRequests).send({ error });
    });
};
export const fetchingLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let limiter: RateLimiter.RateLimiterMongo = null;
  limiter = fetchingLimiter;

  return limiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch((rateLimiterRes) => {
      const error = `You've made too many failed attempts in a short period of time, please try again at ${moment()
        .add(rateLimiterRes.msBeforeNext, 'milliseconds')
        .format()}`;
      return res.status(HTTPStatus.TooManyRequests).send({ error });
    });
};
