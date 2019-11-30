import { Model } from './mongoModel';
import { User } from './user';
import { Blog } from './blogs';

type GeneralCommentModel = {
  text: string;
  rate?: number;
  deleted?: Date;
};

export type SaveCommentModel = GeneralCommentModel & {
  user: string;
  blog: string;
  parent?: string;
  replies?: string[];
};

export type CommentModel = GeneralCommentModel & {
  user: User;
  blog: Blog;
  parent?: Comment;
  replies?: Comment[];
};

export type Comment = Model<CommentModel>;
