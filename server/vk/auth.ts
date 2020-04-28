import { Request, Response } from 'express-serve-static-core';
import { buildQueryString, callApi } from 'server/utils/api';
import config from 'server/config';
import { scopes } from './constants';
import { formatString } from 'server/formator';
import { registerExternalUser } from 'server/operations';
import { authUser } from 'server/identity';
import { HTTPStatus, LocalError } from 'server/lib/models';

export const vKAuthFirstStep = (req: Request, res: Response) => {
  const url = `https://oauth.vk.com/authorize${buildQueryString([
    { client_id: config.VK_CLIENT_ID },
    { redirect_uri: config.SITE_URI + 'login/vk/complete' },
    { response_type: 'code' },
    { scope: scopes.join('+') },
    { state: '{}' }
  ])}`;
  res.redirect(url);
};

export const processVKLogin = async (req: Request, res: Response) => {
  const onSuccess = () => {
    return res.render('finishAuth', { layout: false });
  };
  const onFail = (error: Error) => {
    return res.status(HTTPStatus.BadRequest).send({ error: error.message });
  };

  const code = req.query['code'] || '';
  if (!code) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
  const data = await getAccessToken(formatString(code));
  if (!data.access_token) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));

  const userInfo = await getUserInfo(data.access_token);

  const user = await registerExternalUser(data.email ?? userInfo.id, userInfo.name);

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
