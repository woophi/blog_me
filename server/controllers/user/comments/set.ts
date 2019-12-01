import { Request, Response } from 'express';
import { Validator } from 'server/validator';
import * as formator from 'server/formator';
import CommentModel from 'server/models/comment';
import BlogModel from 'server/models/blogs';
import UserModel from 'server/models/users';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { Comment, SaveCommentModel } from 'server/models/types';
import { EventBus, BusEvents } from 'server/lib/events';

export const createBlogComment = async (req: Request, res: Response) => {
  try {
    const data = {
      blogId: req.body.blogId,
      text: req.body.text,
      userId: req.session?.userId,
      parentId: req.body.parentId || ''
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        blogId: validator.required,
        text: validator.required,
        userId: validator.notMongooseObject
      },
      data
    );

    await formator.formatData(
      {
        blogId: formator.formatNumber,
        text: formator.formatString,
        userId: formator.formatString,
        parentId: formator.formatString
      },
      data
    );

    const blog = await BlogModel.findOne({
      blogId: data.blogId,
      deleted: null
    }).exec();

    if (!blog) return res.sendStatus(HTTPStatus.NotFound);

    const user = await UserModel.findById(data.userId).exec();

    if (!user) return res.sendStatus(HTTPStatus.NotFound);

    let parenComment: Comment = null;
    if (data.parentId) {
      parenComment = await CommentModel.findById(data.parentId).exec();
      if (!parenComment) return res.sendStatus(HTTPStatus.BadRequest);
    }

    const newComment = await new CommentModel({
      blog: blog.id,
      text: data.text,
      user: data.userId,
      parent: parenComment?.id
    } as SaveCommentModel).save();

    if (parenComment) {
      await parenComment
        .set({
          replies: [...parenComment.replies, newComment.id]
        })
        .save();
    }

    await blog
      .set({
        comments: [...blog.comments, newComment.id]
      })
      .save();

    await user
      .set({
        comments: [...user.comments, newComment.id]
      })
      .save();

    if (parenComment) {
      EventBus.emit(BusEvents.NEW_REPLIE);
    } else {
      EventBus.emit(BusEvents.NEW_COMMENT);
    }

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};

export const rateBlogComment = async (req: Request, res: Response) => {
  try {
    const data = {
      commentId: req.body.commentId,
      rate: req.body.rate ?? false,
      user: req.session?.userId
    };
    const validator = new Validator(req, res);
    await validator.check(
      {
        commentId: validator.notMongooseObject,
        rate: validator.required,
        user: validator.notMongooseObject
      },
      data
    );

    await formator.formatData(
      {
        commentId: formator.formatString,
        rate: formator.formatBoolean,
        user: formator.formatString
      },
      data
    );

    const comment = await CommentModel.findById(data.commentId)
      .where('deleted', null)
      .exec();

    if (!comment) return res.sendStatus(HTTPStatus.NotFound);

    const exists = await UserModel.findById(data.user)
      .where('rates')
      .in([data.commentId])
      .lean();

    if (exists) return res.sendStatus(HTTPStatus.Conflict);

    await comment
      .set({
        rate: data.rate ? (comment.rate += 1) : (comment.rate -= 1)
      })
      .save();

    await UserModel.findByIdAndUpdate(data.user, {
      $push: { rates: comment.id }
    });

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.BadRequest);
  }
};
