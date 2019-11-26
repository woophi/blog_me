import BlogModel from 'server/models/blogs';
import * as models from 'server/models/types';
import { Request, Response, NextFunction } from 'express';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { getLanguageIdByLocaleId } from 'server/operations';
import { EventBus, BusEvents } from 'server/lib/events';

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = new Validator(req, res, next);
    const data = {
      body: req.body.content,
      coverPhotoUrl: req.body.coverPhotoUrl,
      publishedBy: req.session.userId,
      publishedDate: req.body.publishedDate,
      title: req.body.title,
      language: req.body.language
    };
    // TODO: add curry
    await validator.check(
      {
        body: validator.required,
        coverPhotoUrl: validator.required,
        publishedBy: validator.notMongooseObject,
        publishedDate: validator.required,
        title: validator.required
      },
      data
    );
    await formator.formatData(
      {
        body: formator.formatString,
        coverPhotoUrl: formator.formatString,
        publishedBy: formator.formatString,
        publishedDate: formator.formatDate,
        title: formator.formatString
      },
      data
    );

    const languageId = await getLanguageIdByLocaleId(data.language);

    delete data.language;
    const newBlog = await new BlogModel({
      ...data,
      language: languageId
    } as models.BlogsSaveModel).save();

    EventBus.emit(BusEvents.NEW_BLOG, { blogId: newBlog.id });
    // TODO: event listener for fb
    return res.send({ id: newBlog.id }).status(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};
