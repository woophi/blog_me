import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Logger } from '../logger';
import * as identity from '../identity';
import { HTTPStatus } from 'server/lib/models';
import { fetchUserData } from './operations';

const decrypt = new identity.Encryption().decrypt;
export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.signedCookies[identity.SessionCookie.SesId];
  if (!req.session.user || !cookie) {
    return res.sendStatus(HTTPStatus.Empty);
  }

  const splitCookie = cookie.split(':');
  const userId = splitCookie[0];

  if (req.session.userId !== userId) {
    return res.sendStatus(HTTPStatus.Empty);
  }
  const encryptedData = splitCookie[1];
  let accessToken = req.session.accessToken;

  try {
    const sessionId = await decrypt(encryptedData, req.session.user.password);
    if (sessionId !== req.sessionID) {
      return res.sendStatus(HTTPStatus.Empty);
    }

    const verifyRefreshToken = identity.verifyToken(req.session.user.refreshToken);
    if (verifyRefreshToken.verificaitionError) {
      return res.sendStatus(HTTPStatus.Empty);
    }

    const access = identity.verifyToken(accessToken);
    if (access.verificaitionError) {
      accessToken = identity.setAccessToken({
        id: userId,
        roles: req.session.user.roles
      });
      req.session.accessToken = accessToken;
      req.session.cookie.expires = new Date(Date.now() + identity.tenDaysInMS);
      req.session.save(() => Logger.debug('resave session'));
    }
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.Empty);
  }
  const userData = await fetchUserData(userId);
  return res.send({ ...userData, token: accessToken, userId });
};
