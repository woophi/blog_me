import { Request, Response, NextFunction } from 'express';
import UserModel from 'server/models/users';
import { HTTPStatus } from 'server/lib/models';

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
      if (err) return res.send({ error: err.message }).status(HTTPStatus.BadRequest);
      return res.sendStatus(HTTPStatus.OK);
    });
  } catch (error) {
    return res.send({ error: error.message }).status(HTTPStatus.ServerError);
  }
};
