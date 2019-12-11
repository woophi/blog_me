import { Request, Response } from 'express';
import { getLoginUrl } from './helpers';
import config from 'server/config';
import { authScopes } from './constants';
import { formatString } from 'server/formator';
import { getAccessToken, getUserInfo } from './operations';
import { registerExternalUser } from 'server/operations';
import { HTTPStatus, LocalError } from 'server/lib/models';
import { authUser } from 'server/identity';

export const fbAuthFirstStep = (req: Request, res: Response) => {
  const url = getLoginUrl(config.SITE_URI + 'login/fb/complete', false, authScopes);
  res.redirect(url);
};

export const processFbLogin = async (
  req: Request,
  res: Response
) => {
  const onSuccess = () => {
    return res.render('finishAuth', { layout: false });
  };
  const onFail = (error: Error) => {
    return res.status(HTTPStatus.BadRequest).send({ error: error.message });
  };

  const code = req.query['code'] || '';
  if (!code) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
  const accessToken = await getAccessToken(formatString(code), 'login/fb/complete');
  if (!accessToken) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
  const userInfo = await getUserInfo(accessToken);

  if (!userInfo?.email) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));

  const user = await registerExternalUser(userInfo.email, userInfo.name);

  return await authUser(req, res, user.email, user.password, onSuccess, onFail);
};
