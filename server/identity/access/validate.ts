import { verifyToken } from './verify';
import { requireUser } from './claims';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { ROLES, tenDaysInMS } from './constants';
import { HTTPStatus } from 'server/lib/models';
import { Encryption } from '../encryption';
import { Logger } from 'server/logger';
import { setAccessToken } from './assign';
import { SessionCookie } from '../session';

const decrypt = new Encryption().decrypt;

export const validateTokenAndCreateNewAccessToken = async (
  signedCookie: string,
  userSession: Request['session']
) => {
  if (!userSession.user || !signedCookie) {
    Logger.info('Connot validate token -> empty params');
    return false;
  }

  const splitCookie = signedCookie.split(':');
  const userId = splitCookie[0];

  if (userSession.userId !== userId) {
    Logger.info('Connot validate token -> wrong user usage, prob stolen cookie');
    return false;
  }
  const encryptedData = splitCookie[1];
  let accessToken = userSession.accessToken;

  try {
    const sessionId = await decrypt(encryptedData, userSession.user.password);
    if (sessionId !== userSession.id) {
      Logger.info(
        'Connot validate token -> different sessionIds',
        sessionId,
        userSession.id
      );
      return false;
    }

    const verifyRefreshToken = verifyToken(userSession.user.refreshToken);
    if (verifyRefreshToken.verificaitionError) {
      Logger.info(
        'Connot validate refresh token -> verifyRefreshToken.verificaitionError',
        JSON.stringify(verifyRefreshToken.verificaitionError)
      );
      return false;
    }

    const { verificaitionError } = verifyToken(accessToken);

    if (verificaitionError) {
      Logger.info(
        'Connot validate access token -> verifyToken.verificaitionError',
        JSON.stringify(verificaitionError)
      );
      Logger.info('---');
      Logger.info('Setup new access token');
      accessToken = setAccessToken({
        id: userId,
        roles: userSession.user.roles,
      });
      userSession.accessToken = accessToken;
      userSession.cookie.expires = new Date(Date.now() + tenDaysInMS);
      userSession.save(() => Logger.debug('resave session'));
    }

    return accessToken;
  } catch (error) {
    Logger.error('Error in token validation ->', JSON.stringify(error));
    return false;
  }
};

export const authorizedForApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!requireUser(req, res)) return;
  const cookie = req.signedCookies[SessionCookie.SesId];

  const validateTokenResult = await validateTokenAndCreateNewAccessToken(
    cookie,
    req.session
  );

  if (!validateTokenResult) {
    return res
      .status(HTTPStatus.Unauthorized)
      .send({ error: 'Authentication failed' });
  }
  next();
};

export const authorizedForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!requireUser(req, res)) return;
  const cookie = req.signedCookies[SessionCookie.SesId];

  const validateTokenResult = await validateTokenAndCreateNewAccessToken(
    cookie,
    req.session
  );

  if (!validateTokenResult) {
    return res
      .status(HTTPStatus.Unauthorized)
      .send({ error: 'Authentication failed' });
  }

  if (!req.session.user?.roles.find((r) => r === ROLES.GODLIKE || r === ROLES.ADMIN))
    return res.status(HTTPStatus.Forbidden).send({ error: 'Unable to get data' });

  next();
};

export const authorizedForSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!requireUser(req, res)) return;
  const cookie = req.signedCookies[SessionCookie.SesId];

  const validateTokenResult = await validateTokenAndCreateNewAccessToken(
    cookie,
    req.session
  );

  if (!validateTokenResult) {
    return res
      .status(HTTPStatus.Unauthorized)
      .send({ error: 'Authentication failed' });
  }

  if (!req.session.user?.roles.find((r) => r === ROLES.GODLIKE))
    return res.status(HTTPStatus.BadRequest).send({ error: 'Unable to get data' });
  next();
};
