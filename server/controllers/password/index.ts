import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Logger } from 'server/logger';
import * as kia from 'server/validator';
import * as mails from 'server/mails';
import { EmailTemplate, UnsubState } from 'server/mails/types';
import UserModel from 'server/models/users';
import LinkModel from 'server/models/links';
import { HTTPStatus } from 'server/lib/models';
import { createUniqLink, checkLinkState } from 'server/mails';
import config from 'server/config';
import { Hashing } from 'server/identity';
import * as formator from 'server/formator';
import { AgendaJobName } from 'server/lib/agenda/constants';

export const resetPassword = async (req: Request, res: Response) => {
  const validate = new kia.Validator(req, res);

  const data = {
    email: req.body.email,
  };

  await validate.check(
    {
      email: validate.isEmail,
    },
    data
  );
  await formator.formatData(
    {
      email: formator.formatEmail,
    },
    data
  );
  try {
    const user = await UserModel.findOne()
      .where('email', data.email)
      .where('password')
      .ne(null)
      .exec();
    if (!user) {
      Logger.info('trying to reset pass for non existed user');
      return res.sendStatus(HTTPStatus.OK);
    }
    const linkId = await createUniqLink(data.email);

    await user.set({ resetId: linkId }).save();

    const mailer = new mails.Mailer(
      AgendaJobName.messageToAdminResetPassword + Date.now(),
      EmailTemplate.resetPass,
      [data.email],
      `Сброс пароля`,
      '',
      'Администрация сайта',
      {
        resetUrl: `${config.SITE_URI}password/update/${linkId}`,
      }
    );

    mailer.performQueue();
  } catch (error) {
    Logger.error('resetPassword error', error);
  }
  return res.sendStatus(HTTPStatus.OK);
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = new kia.Validator(req, res);

  const data = {
    password: req.body.password,
    linkId: req.body.linkId,
  };

  await validate.check(
    {
      password: validate.required,
      linkId: validate.required,
    },
    data
  );

  await formator.formatData(
    {
      password: formator.formatString,
      linkId: formator.formatString,
    },
    data
  );
  try {
    const user = await UserModel.findOne()
      .where('resetId', data.linkId)
      .where('password')
      .ne(null)
      .exec();
    if (!user) return res.sendStatus(HTTPStatus.OK);
    const Link = await LinkModel.findOne({
      uniqId: data.linkId,
    }).exec();

    const state = checkLinkState(Link);

    if (state === UnsubState.INVALID) {
      return res.sendStatus(HTTPStatus.OK);
    }

    const hashing = new Hashing();
    const newPass = await hashing.hashPassword(data.password);

    await user.set({ password: newPass, resetId: null }).save();

    await Link.remove();
    return res.status(HTTPStatus.OK).send(user.email);
  } catch (error) {
    Logger.error('updatePassword error', error);
    return res.sendStatus(HTTPStatus.OK);
  }
};
