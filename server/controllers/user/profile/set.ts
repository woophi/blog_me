import { Request, Response } from 'express-serve-static-core';
import { Validator } from 'server/validator';
import * as formator from 'server/formator';
import UserModel from 'server/models/users';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      userId: req.session?.userId,
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        userId: validator.notMongooseObject,
        name: validator.required,
        email: validator.isEmail,
      },
      data
    );

    await formator.formatData(
      {
        userId: formator.formatString,
        name: formator.formatString,
        email: formator.formatEmail,
      },
      data
    );

    const user = await UserModel.findById(data.userId).exec();

    if (!user) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    await user
      .set({
        name: data.name,
        email: data.email,
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
