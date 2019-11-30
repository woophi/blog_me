import BlogModel from 'server/models/blogs';
import LikeModel from 'server/models/likes';
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
      limit: req.query.limit ?? 50
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
      liked
    });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
