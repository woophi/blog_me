import { Request, Response, NextFunction } from 'express';
import { buildQueryString, callApi } from 'server/utils/api';
import config from 'server/config';
import { scopes } from './constants';
import { formatString } from 'server/formator';
import { registerExteranlUser } from 'server/operations';
import { authUser } from 'server/identity';
import { HTTPStatus } from 'server/lib/models';

export const vKAuthFirstStep = (req: Request, res: Response, next: NextFunction) => {
  const url = `https://oauth.vk.com/authorize${buildQueryString([
    { client_id: config.VK_CLIENT_ID },
    { redirect_uri: config.SITE_URI + 'login/vk/complete' },
    { response_type: 'code' },
    { scope: scopes.join('+') },
    { state: '{}' }
  ])}`;
  res.redirect(url);
};

export const processVKLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query['code'] || '';
  if (!code) return res.redirect('/');
  const data = await getAccessToken(formatString(code));
  if (!data.access_token) return res.redirect('/');

  const userInfo = await getUserInfo(data.access_token);

  const user = await registerExteranlUser(data.email ?? userInfo.id, userInfo.name);

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

const getAccessToken = async (code: string) => {
  const { email, access_token, user_id } = await callApi(
    'post',
    `https://oauth.vk.com/access_token${buildQueryString([
      { code: code },
      { client_id: config.VK_CLIENT_ID },
      { client_secret: config.VK_CLIENT_SECRET },
      { redirect_uri: config.SITE_URI + 'login/vk/complete' }
    ])}`
  );
  return {
    email,
    access_token,
    user_id
  };
};

const getUserInfo = async (accessToken: string) => {
  const data = await callApi(
    'post',
    `https://api.vk.com/method/users.get${buildQueryString([
      { access_token: accessToken },
      { fields: ['screen_name', 'nickname'].join(',') }
    ])}&v=5.103`
  );
  const { id, first_name, last_name, screen_name, nickname } = data.response[0];
  return {
    id: id,
    name: nickname || screen_name || first_name + ' ' + last_name
  };
};
