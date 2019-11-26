import { Model } from './mongoModel';
import { User } from './user';
import { Blog } from './blogs';

type GeneralCommentModel = {
  text: string;
  deleted?: Date;
};

export type SaveCommentModel = GeneralCommentModel & {
  user: string;
  blog: string;
};

export type CommentModel = GeneralCommentModel & {
  user: User;
  blog: Blog;
};

export type Comment = Model<CommentModel>;
