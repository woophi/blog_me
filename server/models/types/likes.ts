import { Model } from './mongoModel';
import { User } from './user';

export type Likes = Model<LikesModel>;

export type LikesModel = {
  user: User;
}
export type LikesSaveModel = {
  user: string;
}
