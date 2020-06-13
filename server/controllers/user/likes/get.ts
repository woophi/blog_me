import LikeModel from 'server/models/likes';
import { Request, Response } from 'express-serve-static-core';
import { HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';

export const getUserLikes = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId as string;

    if (!userId) {
      return res.sendStatus(HTTPStatus.BadRequest);
    }

    const likes = await LikeModel.find()
      .where('user', userId)
      .populate({
        path: 'blog',
        select: 'blogId title -_id',
      })
      .select('blog')
      .lean();

    return res.send(likes);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
