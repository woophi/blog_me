import BlogModel from 'server/models/blogs';
import LikeModel from 'server/models/likes';
import UserModel from 'server/models/users';
import { Request, Response } from 'express';
import { HTTPStatus } from 'server/lib/models';
import * as formator from 'server/formator';
import { Logger } from 'server/logger';
import { Validator } from 'server/validator';

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

    const user = await UserModel.findById(req.session?.userId).exec();

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
