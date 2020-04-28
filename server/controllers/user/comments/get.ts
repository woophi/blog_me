import { Request, Response } from 'express-serve-static-core';
import { Validator } from 'server/validator';
import * as formator from 'server/formator';
import CommentModel from 'server/models/comment';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';

export const getBlogComments = async (req: Request, res: Response) => {
  try {
    const data = {
      offset: req.query.offset,
      limit: 50,
      userId: req.session?.userId
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        userId: validator.notMongooseObject,
        offset: validator.required,
        limit: validator.required
      },
      data
    );

    await formator.formatData(
      {
        userId: formator.formatString,
        offset: formator.formatNumber,
        limit: formator.formatNumber
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
      .sort({ createdAt: -1 })
      .select('text user replies rate')
      .skip(data.offset)
      .limit(data.limit)
      .lean();

    return res.send(comments);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
