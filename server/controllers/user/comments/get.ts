import { Request, Response } from 'express-serve-static-core';
import { Validator } from 'server/validator';
import * as formator from 'server/formator';
import CommentModel from 'server/models/comment';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';

export const getUserComments = async (req: Request, res: Response) => {
  try {
    const data = {
      userId: req.session?.userId
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        userId: validator.notMongooseObject
      },
      data
    );

    await formator.formatData(
      {
        userId: formator.formatString
      },
      data
    );

    const comments = await CommentModel.find()
      .where('user', data.userId)
      .where('deleted', null)
      .where('parent', null)
      .populate({
        path: 'user',
        select: 'name gravatarPhotoUrl'
      })
      .populate({
        path: 'blog',
        select: 'blogId title -_id'
      })
      .sort({ createdAt: -1 })
      .select('text user replies rate blog')
      .lean();

    return res.send(comments);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
