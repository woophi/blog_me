import { Request, Response, NextFunction } from 'express';
import LanguageModel from 'server/models/language';
import * as models from 'server/models/types';
import { Logger } from 'server/logger';
import * as kia from 'server/validator';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';
import moment from 'moment';

export const createNewLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = new kia.Validator(req, res);

  const languageData: models.LanguageModel = {
    localeId: req.body.localeId,
    name: req.body.name
  };
  await validate.check(
    {
      localeId: validate.required,
      name: validate.required
    },
    languageData
  );
  await formator.formatData(
    {
      name: formator.formatString,
      localeId: formator.formatString
    },
    languageData
  );
  try {
    const exists = await LanguageModel.findOne({
      localeId: languageData.localeId
    }).lean();
    if (exists) {
      return res.send({ error: 'Language already exists' });
    }
    await new LanguageModel(languageData).save();
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
export const toggleActivationLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = new kia.Validator(req, res);

  const languageData: Partial<models.LanguageModel> = {
    localeId: req.body.localeId
  };
  await validate.check(
    {
      localeId: validate.required
    },
    languageData
  );
  await formator.formatData(
    {
      localeId: formator.formatString
    },
    languageData
  );
  try {
    const language = await LanguageModel.findOne({
      localeId: languageData.localeId
    }).exec();
    if (!language) return res.sendStatus(HTTPStatus.NotFound);

    const deleted = language.deleted ? null : moment().toDate();
    await language.set('deleted', deleted).save();
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
