import { Request, Response, NextFunction } from 'express';
import { Logger } from 'server/logger';
import * as kia from 'server/validator';
import * as mails from 'server/mails';
import { EmailTemplate, UnsubState } from 'server/mails/types';
import UserModel from 'server/models/users';
import LinkModel from 'server/models/links';
import * as models from 'server/models/types';
import { ROLES } from 'server/identity';
import { HTTPStatus } from 'server/lib/models';
import { checkLinkState } from 'server/mails';
import * as formator from 'server/formator';

export const sendMailToAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = new kia.Validator(req, res);

  const message = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };

  await validate.check(
    {
      name: validate.required,
      email: validate.isEmail,
      message: validate.required
    },
    message
  );
  await formator.formatData(
    {
      name: formator.formatString,
      email: formator.formatEmail,
      message: formator.formatString
    },
    message
  );
  const admins = await UserModel.find()
    .where('roles')
    .in([ROLES.ADMIN, ROLES.GODLIKE])
    .select('email -_id')
    .exec();
  const addresses = admins.map(ue => ue.email);
  const mailer = new mails.Mailer(
    'message to admins from guest',
    EmailTemplate.contactEmail,
    addresses,
    `новое сообщение от посетителя ${message.name}`,
    '',
    message.email,
    {
      message: message.message
    }
  );
  mailer.performQueue();
  return res.sendStatus(HTTPStatus.OK);
};

export const getUnsubLinkState = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const linkId = formator.formatString(req.query['uniqId']);
  if (!linkId) return res.status(HTTPStatus.BadRequest).send(UnsubState.INVALID);

  const Link = await LinkModel.findOne({ uniqId: linkId }).exec();

  const state = checkLinkState(Link);

  Logger.debug(state);

  return res.status(HTTPStatus.OK).send(state);
};

export const guestUnsub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkId = formator.formatString(req.body.uniqId);
    if (!linkId) return res.status(HTTPStatus.BadRequest);

    const Link = (await LinkModel.findOne({
      uniqId: linkId
    }).exec()) as models.Links;

    const state = checkLinkState(Link);

    if (state === UnsubState.INVALID) {
      return res.sendStatus(HTTPStatus.OK);
    }

    // TODO: action to unsub person
    await Link.remove();
  } catch (error) {
    Logger.error('error to update SubscriberModel', error);
  } finally {
    return res.sendStatus(HTTPStatus.OK);
  }
};
