import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';
import * as kia from '../validator';
import * as identity from '../identity';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const validate = new kia.Validator(req, res, next);

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

  Logger.debug(`init auth controller ${new Date().toLocaleTimeString()}`);
  const auth = new identity.Auth(userData, req, res, onSuccess, onFail);

  Logger.debug(`proceed with signin ${new Date().toLocaleTimeString()}`);
  try {
    await auth.signin();
  } catch {
    return onFail(auth.generalError);
  }
};
