import { Model } from './mongoModel';
import { User } from './user';

type GeneralCommentModel = {
  text: string;
  deleted?: Date;
};

export type SaveCommentModel = GeneralCommentModel & {
  user: string;
};

export type CommentModel = GeneralCommentModel & {
  user: User;
};

export type Comment = Model<CommentModel>;
