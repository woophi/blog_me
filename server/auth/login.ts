import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';
import * as kia from '../validator';
import * as identity from '../identity';
import * as formator from 'server/formator';
import { ExternalLogin } from './types';
import { googleAuthFirstStep, processGoogleLogin } from 'server/google';
import { HTTPStatus } from 'server/lib/models';
import { fbAuthFirstStep, processFbLogin } from 'server/facebook';
import { vKAuthFirstStep, processVKLogin } from 'server/vk';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const validate = new kia.Validator(req, res);

  Logger.debug(`starting authenticate user ${new Date().toLocaleTimeString()}`);

  const userData = {
    email: req.body.email,
    password: req.body.password
  };
  await validate.check(
    {
      email: validate.isEmail,
      password: validate.required
    },
    userData
  );
  await formator.formatData(
    {
      email: formator.formatEmail,
      password: formator.formatString
    },
    userData
  );
  const onSuccess = (token: string) => {
    Logger.debug('user success auth');
    return res.send({ token }).status(HTTPStatus.OK);
  };
  const onFail = (error: Error) => {
    return res.status(HTTPStatus.BadRequest).send({ error: error.message });
  };

  return await identity.authUser(
    req,
    res,
    userData.email,
    userData.password,
    onSuccess,
    onFail
  );
};

export const externalLogin = (req: Request, res: Response) => {
  const type = req.params.external as ExternalLogin;
  if (type === 'google') {
    return googleAuthFirstStep(req, res);
  }
  if (type === 'fb') {
    return fbAuthFirstStep(req, res);
  }
  if (type === 'vk') {
    return vKAuthFirstStep(req, res);
  }
  return res.sendStatus(HTTPStatus.OK);
};
export const externalLoginComplete = (req: Request, res: Response) => {
  const type = req.params.external as ExternalLogin;
  if (type === 'google') {
    return processGoogleLogin(req, res);
  }
  if (type === 'fb') {
    return processFbLogin(req, res);
  }
  if (type === 'vk') {
    return processVKLogin(req, res);
  }
  return res.sendStatus(HTTPStatus.OK);
};

