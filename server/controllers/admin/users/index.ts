import { Request, Response, NextFunction } from 'express';
import UserModel from 'server/models/users';
import { Logger } from 'server/logger';
import * as kia from 'server/validator';
import * as identity from 'server/identity';
import { HTTPStatus } from 'server/lib/models';
import { ROLES } from 'server/identity';
import * as formator from 'server/formator';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = new kia.Validator(req, res, next);

  Logger.debug(`starting validate new user ${new Date().toLocaleTimeString()}`);

  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };
  await validate.check(
    {
      email: validate.isEmail,
      name: validate.required,
      password: validate.required
    },
    userData
  );

  await formator.formatData(
    {
      email: formator.formatEmail
    },
    userData
  );

  try {
    const exists = await UserModel.findOne({
      email: userData.email.toLowerCase()
    }).lean();
    if (exists) {
      return res.send({ error: 'User already exists' }).status(HTTPStatus.Conflict);
    }
    const hashing = new identity.Hashing();
    Logger.debug(
      `creating hash for new user password ${new Date().toLocaleTimeString()}`
    );

    userData.password = await hashing.hashPassword(userData.password);
    Logger.debug(
      `created hash for new user password ${new Date().toLocaleTimeString()}`
    );

    // TODO: choose from post data
    await new UserModel({ ...userData, roles: [ROLES.ADMIN] }).save();
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
