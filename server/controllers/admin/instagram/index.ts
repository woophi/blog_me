import { Request, Response, NextFunction } from 'express-serve-static-core';
import { IgCheckpointError } from 'instagram-private-api';
import config from 'server/config';
import Bluebird from 'bluebird';
import { HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';
import { ig } from 'server/instagram';
import { formatString } from 'server/formator';

export const verrifyLoginInstagram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ig.state.generateDevice(config.IG_USERNAME);

  await Bluebird.try(async () => {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    Logger.debug('auth ig is cool');
    return res.send(true).status(HTTPStatus.OK);
  }).catch(IgCheckpointError, async () => {
    await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
    Logger.info('generate challenge');
    return res.send(false).status(HTTPStatus.OK);
  });
};

export const checkLoginInstagram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Logger.debug('checkLoginInstagram');
    ig.state.generateDevice(config.IG_USERNAME);
    await ig.account.login(config.IG_USERNAME, config.IG_PASSWORD);

    return res.send(true).status(HTTPStatus.OK);
  } catch {
    return res.send(false).status(HTTPStatus.OK);
  }
};
export const sendCodeInstagram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.code) return res.send(false).status(HTTPStatus.OK);
  try {
    Logger.debug('try to send code');
    await ig.challenge.sendSecurityCode(formatString(req.body.code));

    return res.send(true).status(HTTPStatus.OK);
  } catch (err) {
    Logger.debug(err);
    return res.send(false).status(HTTPStatus.OK);
  }
};
