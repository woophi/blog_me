import { Request, Response, NextFunction } from 'express';
import { getLoginUrl } from './helpers';
import config from 'server/config';
import { authScopes } from './constants';
import { formatString } from 'server/formator';
import { getAccessToken, getUserInfo } from './operations';
import { registerExteranlUser } from 'server/operations';
import { HTTPStatus } from 'server/lib/models';
import { authUser } from 'server/identity';

export const fbAuthFirstStep = (req: Request, res: Response, next: NextFunction) => {
  const url = getLoginUrl(config.SITE_URI + 'login/fb/complete', false, authScopes);
  res.redirect(url);
};

export const processFbLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query['code'] || '';
  if (!code) return res.redirect('/');
  const accessToken = await getAccessToken(formatString(code), 'login/fb/complete');
  if (!accessToken) return res.redirect('/');
  const userInfo = await getUserInfo(accessToken);

  if (!userInfo?.email) return res.redirect('/login');

  const user = await registerExteranlUser(userInfo.email, userInfo.name);

  const onSuccess = (token: string) => {
    // TODO: redirect to previus url
    return res.send({ token }).status(HTTPStatus.OK);
  };
  const onFail = (error: Error) => {
    // TODO: redirect to previus url
    // and show error status or open separate window so close it
    return res.status(HTTPStatus.BadRequest).send({ error: error.message });
  };

  return await authUser(req, res, user.email, user.password, onSuccess, onFail);
};
