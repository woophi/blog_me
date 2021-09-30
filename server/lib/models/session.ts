import { User } from 'server/models/types/user';

export type SessionData = {
  user: User;
  userId: string;
  vkUserId?: number;
  accessToken: string;
};
