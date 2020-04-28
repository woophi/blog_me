import { Request, Response } from 'express-serve-static-core';
import { Auth } from './create';

export const authUser = async (
  req: Request,
  res: Response,
  email: string,
  password: string,
  onSuccess: (token: string) => any,
  onFail: (error: Error) => any
) => {
  const auth = new Auth(
    {
      email,
      password
    },
    req,
    res,
    onSuccess,
    onFail
  );

  try {
    await auth.signin();
  } catch {
    return onFail(auth.generalError);
  }
};
