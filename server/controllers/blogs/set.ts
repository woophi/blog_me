import BlogModel from 'server/models/blogs';
import { Request, Response } from 'express-serve-static-core';
import { HTTPStatus, VisitorCookie } from 'server/lib/models';
import * as formator from 'server/formator';
import { Logger } from 'server/logger';
import { Validator } from 'server/validator';
import moment from 'moment';

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
      .select('title coverPhotoUrl publishedDate blogId shortText views -_id')
      .skip(0)
      .limit(40)
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

    await blog
      .set({
        views: blog.views + 1
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
