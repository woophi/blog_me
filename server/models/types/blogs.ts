import { Model } from './mongoModel';
import { User } from './user';
import { Likes } from './likes';
import { Comment } from './comment';
import { Language } from './language';

export type Blog = Model<BlogsModel>;

export type BlogsModelGeneral = {
  blogId: number;
  title: string;
  coverPhotoUrl: string;
  body: string;
  publishedDate: Date;
  deleted?: Date;
  draft?: boolean;
};

export type BlogsModel = BlogsModelGeneral & {
  publishedBy: User;
  language: Language;
  likes?: Likes[];
  comments?: Comment[];
};
export type BlogsSaveModel = BlogsModelGeneral & {
  publishedBy: string;
  language: string;
  likes?: string[];
  comments?: string[];
};
