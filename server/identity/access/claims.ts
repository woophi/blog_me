import UserModel from 'server/models/users';
import { User } from 'server/models/types';
import { Logger } from 'server/logger';
import * as options from 'server/options';
import { Request, Response } from 'express';

export const getRoles = async (userId: string) => {
	let roles = [];
  const user: User = await UserModel.findById(userId).lean();
  Logger.debug('get user roles ' + user.roles.toString())
	roles = user.roles ? user.roles : [];
	return roles;
}

export const requireUser = (req: Request, res: Response) => {
	if (!req.session.user) {
		options.set('prevUrl', req.url);
		res.redirect('/login');
		return false;
	}
	return true;
};
