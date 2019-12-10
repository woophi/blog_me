import BlogModel from 'server/models/blogs';
import LikeModel from 'server/models/likes';
import CommentModel from 'server/models/comment';
import { Request, Response } from 'express';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';
import { Logger } from 'server/logger';
import { Validator } from 'server/validator';
import moment from 'moment';

export const getGuestBlogs = async (req: Request, res: Response) => {
  try {
    const data = {
      offset: req.query.offset,
      limit: 50
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        offset: validator.required,
        limit: validator.required
      },
      data
    );

    await formator.formatData(
      {
        offset: formator.formatNumber,
        limit: formator.formatNumber
      },
      data
    );

    const blogs = await BlogModel.find()
      .where('deleted', null)
      .where('draft', false)
      .where('publishedDate')
      .lte(moment().toDate())
      .sort({ publishedDate: -1 })
      .select('title coverPhotoUrl publishedDate blogId -_id')
      .skip(data.offset)
      .limit(data.limit)
      .lean();

    return res.send(blogs);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};

export const getGuestBlog = async (req: Request, res: Response) => {
  try {
    const data = {
      blogId: req.query.blogId
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        blogId: validator.required
      },
      data
    );

    await formator.formatData(
      {
        blogId: formator.formatNumber
      },
      data
    );

    const blog = await BlogModel.findOne({ blogId: data.blogId })
      .where('deleted', null)
      .where('draft', false)
      .lean();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    let liked = false;

    if (req.session?.userId) {
      liked =
        (await LikeModel.find()
          .where('user', req.session?.userId)
          .where('blog', blog._id)
          .countDocuments()) > 0;
    }

    return res.send({
      blogId: blog.blogId,
      title: blog.title,
      body: blog.body,
      coverPhotoUrl: blog.coverPhotoUrl,
      publishedDate: blog.publishedDate,
      comments: blog.comments?.length ?? 0,
      liked,
      updatedAt: blog.updatedAt
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};

export const getGuestBlogComments = async (req: Request, res: Response) => {
  try {
    const data = {
      blogId: req.query.blogId,
      offset: req.query.offset,
      limit: 50
    };

    const validator = new Validator(req, res);

    await validator.check(
      {
        blogId: validator.required,
        offset: validator.required,
        limit: validator.required
      },
      data
    );

    await formator.formatData(
      {
        blogId: formator.formatNumber,
        offset: formator.formatNumber,
        limit: formator.formatNumber
      },
      data
    );

    const blog = await BlogModel.findOne({ blogId: data.blogId, deleted: null })
      .select('_id')
      .lean();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    const comments = await CommentModel.find()
      .where('blog', blog._id)
      .where('deleted', null)
      .where('parent', null)
      .populate({
        path: 'user',
        select: 'name -_id'
      })
      .sort({ createdAt: -1, rate: 1 })
      .select('text user replies rate createdAt')
      .skip(data.offset)
      .limit(data.limit)
      .lean();

    return res.send(comments);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
export const getGuestBlogCommentReplies = async (req: Request, res: Response) => {
  try {
    const data = {
      parentId: req.query.parentId,
      offset: req.query.offset,
      limit: 50
    };

    const validator = new Validator(req, res);

    await validator.check(
      {
        parentId: validator.notMongooseObject,
        offset: validator.required,
        limit: validator.required
      },
      data
    );

    await formator.formatData(
      {
        parentId: formator.formatString,
        offset: formator.formatNumber,
        limit: formator.formatNumber
      },
      data
    );

    const comments = await CommentModel.find()
      .where('deleted', null)
      .where('parent', data.parentId)
      .populate({
        path: 'user',
        select: 'name -_id'
      })
      .sort({ createdAt: -1, rate: 1 })
      .select('text user replies rate createdAt')
      .skip(data.offset)
      .limit(data.limit)
      .lean();

    return res.send(comments);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
