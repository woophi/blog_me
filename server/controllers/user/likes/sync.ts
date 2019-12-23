import UserModel from 'server/models/users';
import LikeModel from 'server/models/likes';
import BlogModel from 'server/models/blogs';
import { Request, Response } from 'express';
import { HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';
import { getBlogObjectId } from 'server/operations';
import { formatNumber } from 'server/formator';

export const getUserLike = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId as string;
    const blogId = formatNumber(req.query.blogId) as number;

    if (!userId || !blogId) {
      return res.sendStatus(HTTPStatus.BadRequest);
    }

    const like =
      (await LikeModel.findOne({
        user: userId,
        blog: await getBlogObjectId(blogId)
      }).countDocuments()) > 0;

    return res.send(like);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
export const userDislike = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId as string;
    const blogId = formatNumber(req.query.blogId) as number;

    if (!userId || !blogId) {
      return res.sendStatus(HTTPStatus.BadRequest);
    }

    const blogObjectId = await getBlogObjectId(blogId);

    const like = await LikeModel.findOne({
      user: userId,
      blog: blogObjectId
    }).exec();

    if (!like) return res.sendStatus(HTTPStatus.NotFound);

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { likes: like.id }
    });

    await BlogModel.findByIdAndUpdate(blogObjectId, {
      $pull: { likes: like.id }
    });

    await like.remove();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
