import { Model } from './mongoModel';
import { User } from './user';
import { Blog } from './blogs';

export type Likes = Model<LikesModel>;

export type LikesModel = {
  user?: User | string;
  blog: Blog | string;
};
export type LikesSaveModel = {
  user?: string;
  blog: string;
}
