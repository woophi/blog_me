import UserModel from 'server/models/users';
import { User } from 'server/models/types';
import * as options from 'server/options';
import { Request, Response } from 'express-serve-static-core';

export const getRoles = async (userId: string) => {
  let roles = [];
  const user: User = await UserModel.findById(userId).lean();
  roles = user.roles ? user.roles : [];
  return roles;
};

export const requireUser = (req: Request, res: Response) => {
  if (!req.session.user) {
    options.set(options.GlobalCache.PrevUrl, req.url);
    res.redirect('/login');
    return false;
  }
  return true;
};
