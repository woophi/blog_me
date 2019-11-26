import { Model } from './mongoModel';
import { ROLES } from '../../identity/access/constants';
import { Comment } from './comment';
import { Language } from './language';
import { Likes } from './likes';

export type UserGeneralModel = {
  email: string;
  roles?: ROLES[];
  password?: string;
  name?: string;
  refreshToken?: string;
  resetId?: string;
};

export type UserModel = UserGeneralModel & {
  language: Language;
  comments?: Comment[];
  likes?: Likes[];
};

export type User = Model<UserModel>;

