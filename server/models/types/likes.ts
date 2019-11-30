import { Model } from './mongoModel';
import { User } from './user';
import { Blog } from './blogs';

export type Likes = Model<LikesModel>;

export type LikesModel = {
  user?: User;
  blog: Blog;
};
export type LikesSaveModel = {
  user?: string;
  blog: string;
}
