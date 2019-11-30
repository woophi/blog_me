import UserModel from 'server/models/users';
import { Request, Response } from 'express';
import { HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';
import dropRepeats from 'ramda/src/dropRepeats';

export const syncUserLikes = async (req: Request, res: Response) => {
  try {
    const likeIds = req.body.likeIds as string[];

    if (!likeIds?.length) {
      return res.sendStatus(HTTPStatus.Empty);
    }

    const user = await UserModel.findById(req.session?.userId).exec();
    if (!user) {
      return res.sendStatus(HTTPStatus.Empty);
    }
    const userLikes = (user.likes as unknown) as string[];
    const likes = dropRepeats(likeIds.concat(userLikes));

    await user
      .set({
        likes
      })
      .save();

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
