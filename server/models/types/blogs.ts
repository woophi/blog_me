import { Model } from './mongoModel';
import { User } from './user';
import { Likes } from './likes';
import { Comment } from './comment';
import { Language } from './language';
import { ShortLink } from './shortLinks';

export type Blog = Model<BlogsModel>;

export type BlogsModelGeneral = {
  blogId: number;
  title: string;
  coverPhotoUrl: string;
  body: string;
  publishedDate: Date;
  deleted?: Date;
  draft?: boolean;
  shortText: string;
  views?: number;
};

export type BlogsModel = BlogsModelGeneral & {
  publishedBy: User;
  localeId: Language;
  shortLink?: ShortLink;
  likes?: Likes[];
  comments?: Comment[];
};
export type BlogsSaveModel = BlogsModelGeneral & {
  publishedBy: string;
  localeId: string;
  shortLink?: string;
  likes?: string[];
  comments?: string[];
};
