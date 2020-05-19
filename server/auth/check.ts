import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Logger } from '../logger';
import * as identity from '../identity';
import { HTTPStatus } from 'server/lib/models';
import { fetchUserData } from './operations';

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  Logger.debug('User check from FE');
  const cookie = req.signedCookies[identity.SessionCookie.SesId];

  const validateTokenResult = await identity.validateTokenAndCreateNewAccessToken(
    cookie,
    req.session
  );

  if (!validateTokenResult) {
    return res.sendStatus(HTTPStatus.Empty);
  }

  const userId = req.session.userId;
  const userData = await fetchUserData(userId);
  return res.send({ ...userData, token: validateTokenResult, userId });
};
