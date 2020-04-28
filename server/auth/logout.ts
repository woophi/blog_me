import { Request, Response, NextFunction } from 'express-serve-static-core';
import UserModel from 'server/models/users';
import { HTTPStatus } from 'server/lib/models';
import { SessionCookie } from 'server/identity';

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.sendStatus(HTTPStatus.Empty);
  }
  try {
    const User = await UserModel.findById(req.session.userId).exec();

    await User.set({
      refreshToken: ''
    }).save();

    req.session.destroy(err => {
      if (err) return res.status(HTTPStatus.BadRequest).send({ error: err.message });

      res.clearCookie('connect.sid');
      res.clearCookie(SessionCookie.SesId);
      return res.sendStatus(HTTPStatus.OK);
    });
  } catch (error) {
    return res.status(HTTPStatus.ServerError).send({ error: error.message });
  }
};
