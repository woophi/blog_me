import BlogModel from 'server/models/blogs';
import * as models from 'server/models/types';
import { Request, Response, NextFunction } from 'express';
import * as formator from 'server/formator';
import { Validator } from 'server/validator';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { getLanguageIdByLocaleId } from 'server/operations';
import { EventBus, BusEvents } from 'server/lib/events';
import moment from 'moment';

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = new Validator(req, res, next);
    const data = {
      body: req.body.body,
      coverPhotoUrl: req.body.coverPhotoUrl,
      publishedBy: req.session.userId,
      publishedDate: req.body.publishedDate,
      title: req.body.title,
      language: req.body.language
    };
    await validator.check(
      {
        body: validator.required,
        coverPhotoUrl: validator.required,
        publishedBy: validator.notMongooseObject,
        publishedDate: validator.required,
        title: validator.required,
        language: validator.required
      },
      data
    );
    await formator.formatData(
      {
        body: formator.formatString,
        coverPhotoUrl: formator.formatString,
        publishedBy: formator.formatString,
        publishedDate: formator.formatDate,
        title: formator.formatString,
        language: formator.formatString
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

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = new Validator(req, res, next);
    const data = {
      body: req.body.body,
      coverPhotoUrl: req.body.coverPhotoUrl,
      publishedDate: req.body.publishedDate,
      title: req.body.title,
      blogId: req.body.blogId
    };
    await validator.check(
      {
        body: validator.required,
        coverPhotoUrl: validator.required,
        publishedDate: validator.required,
        title: validator.required,
        blogId: validator.notMongooseObject
      },
      data
    );
    await formator.formatData(
      {
        body: formator.formatString,
        coverPhotoUrl: formator.formatString,
        publishedDate: formator.formatDate,
        title: formator.formatString,
        blogId: formator.formatString
      },
      data
    );

    const blog = await BlogModel.findById(data.blogId).exec();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    await blog.set({
      title: data.title,
      body: data.body,
      coverPhotoUrl: data.coverPhotoUrl,
      publishedDate: data.publishedDate
    }).save();

    return res.send({
      id: blog.id,
      title: blog.title,
      body: blog.body,
      coverPhotoUrl: blog.coverPhotoUrl,
      publishedDate: blog.publishedDate,
      likes: blog.likes?.length ?? 0,
      comments: blog.comments?.length ?? 0
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.ServerError);
  }
};

export const deleteBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = new Validator(req, res, next);
    const data = {
      blogIds: req.body.blogIds as string[]
    };
    await validator.check(
      {
        blogIds: validator.notIsEmpty
      },
      data
    );

    for (const blogId of data.blogIds) {
      Logger.debug('deleting blogid', blogId);
      await BlogModel.findByIdAndUpdate(blogId, { deleted: moment().toDate() });
    }

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);

    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
