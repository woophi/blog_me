import BlogModel from 'server/models/blogs';
import LikeModel from 'server/models/likes';
import UserModel from 'server/models/users';
import { Request, Response } from 'express';
import { HTTPStatus, VisitorCookie } from 'server/lib/models';
import * as formator from 'server/formator';
import { Logger } from 'server/logger';
import { Validator } from 'server/validator';
import moment from 'moment';

export const guestLikeBlog = async (req: Request, res: Response) => {
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
      .exec();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    const user = await UserModel.findById(req.session?.userId)
      .populate('likes')
      .exec();

    if (user) {
      const exists = user.likes.some(l => l.blog.id == blog.id);

      if (exists) return res.sendStatus(HTTPStatus.Conflict);
    }

    const update = user
      ? {
          blog: blog.id,
          user: user.id
        }
      : {
          blog: blog.id
        };

    const newLike = await new LikeModel(update).save();

    if (user) {
      await user
        .set({
          likes: [...user.likes, newLike.id]
        })
        .save();
    }

    await blog
      .set({
        likes: [...blog.likes, newLike.id]
      })
      .save();

    return res.send({ likeId: newLike.id });
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};

export const searchBlogs = async (req: Request, res: Response) => {
  try {
    const data = {
      q: req.query.q
    };
    const validator = new Validator(req, res);

    await validator.check(
      {
        q: validator.required
      },
      data
    );

    await formator.formatData(
      {
        q: formator.formatHtml
      },
      data
    );

    const blogs = await BlogModel.find(
      { $text: { $search: data.q } },
      { score: { $meta: 'textScore' } }
    )
      .where('deleted', null)
      .where('draft', false)
      .where('publishedDate')
      .lte(moment().toDate())
      .sort({ score: { $meta: 'textScore' } })
      .select('title publishedDate blogId shortText -_id')
      .skip(0)
      .limit(5)
      .lean();
    return res.send(blogs);
  } catch (error) {
    Logger.error(error);

    return res.sendStatus(HTTPStatus.BadRequest);
  }
};

export const increaseBlogViews = async (req: Request, res: Response) => {
  try {
    const data = {
      blogId: req.body.blogId
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
      .exec();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    const cookieViews = req.cookies[VisitorCookie.View] || '';

    const blogIds = cookieViews?.split(',');

    if (blogIds.some(id => Number(id) === data.blogId)) {
      return res.sendStatus(HTTPStatus.Conflict);
    }

    await blog
      .set({
        views: blog.views + 1
      })
      .save();

    res.cookie(
      VisitorCookie.View,
      cookieViews ? `${cookieViews},${data.blogId}` : `${data.blogId}`,
      {
        maxAge: 30 * 60 * 1000
      }
    );
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
