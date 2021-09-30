import config from '../../config';
import * as jwt from 'jsonwebtoken';
import { Claims, oneDay, tenDays } from './constants';
import { verifyToken } from './verify';

export const setAccessToken = (params: Claims) => {
  return jwt.sign(params, config.ACCESS_SECRET, {
    expiresIn: oneDay
  });
};
export const setRefreshToken = (params: Claims, token?: string) => {
  if (token) {
    const { verificaitionError } = verifyToken(token);
    if (!verificaitionError) {
      return token;
    }
  }
  return jwt.sign(params, config.ACCESS_SECRET, {
    expiresIn: tenDays
  });
};
