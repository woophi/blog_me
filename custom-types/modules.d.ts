import { User } from 'server/models/types';

declare module 'express-session' {
  interface SessionData {
    user: User;
    userId: string;
    vkUserId?: number;
    accessToken: string;
  }
}
