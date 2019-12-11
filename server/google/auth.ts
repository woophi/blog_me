import { Request, Response } from 'express';
import { buildQueryString, callApi } from 'server/utils/api';
import config from 'server/config';
import { scopes } from './constants';
import { formatString } from 'server/formator';
import { registerExternalUser } from 'server/operations';
import { authUser } from 'server/identity';
import { HTTPStatus, LocalError } from 'server/lib/models';

export const googleAuthFirstStep = (req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth${buildQueryString([
    { client_id: config.G_CLIENT_ID },
    { redirect_uri: config.SITE_URI + 'login/google/complete' },
    { response_type: 'code' },
    { scope: scopes.join('+') },
    { prompt: 'select_account' },
    { state: '{}' }
  ])}`;
  res.redirect(url);
};

export const processGoogleLogin = async (req: Request, res: Response) => {
  const onSuccess = () => {
    return res.render('finishAuth', { layout: false });
  };
  const onFail = (error: Error) => {
    return res.status(HTTPStatus.BadRequest).send({ error: error.message });
  };

  const code = req.query['code'] || '';
  if (!code) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
  const accessToken = await getAccessToken(formatString(code));
  if (!accessToken) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
  const userInfo = await getUserInfo(accessToken);

  if (!userInfo?.email) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));

  const user = await registerExternalUser(userInfo.email, userInfo.name);

  return await authUser(req, res, user.email, user.password, onSuccess, onFail);
};

const getAccessToken = async (code: string) => {
  const { access_token } = await callApi(
    'post',
    `https://www.googleapis.com/oauth2/v4/token${buildQueryString([
      { code: code },
      { client_id: config.G_CLIENT_ID },
      { client_secret: config.G_CLIENT_SECRET },
      { redirect_uri: config.SITE_URI + 'login/google/complete' },
      { grant_type: 'authorization_code' }
    ])}`
  );
  return access_token ?? '';
};

const getUserInfo = async (accessToken: string) => {
  const { email, name } = await callApi(
    'get',
    `https://www.googleapis.com/oauth2/v2/userinfo${buildQueryString([
      { access_token: accessToken },
      { fields: ['name', 'email'].join(',') }
    ])}`
  );
  return {
    email,
    name
  };
};
