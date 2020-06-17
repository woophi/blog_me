import { callFbApi } from './api';
import config from '../config';
import { Logger } from '../logger';

export const getAccessToken = async (
  code: string,
  cbUrl: string
): Promise<string> => {
  const { access_token } = await callFbApi('post', 'oauth/access_token', [
    { client_id: config.FB_APP_ID },
    { client_secret: config.FB_APP_SECRET },
    { redirect_uri: config.SITE_URI + cbUrl },
    { code: code },
  ]);
  Logger.debug('Getting access_token');
  return access_token ? access_token : '';
};

export const getUserInfo = async (accessToken: string) => {
  const { email, name } = await callFbApi('get', 'me', [
    { access_token: accessToken },
    { fields: ['name', 'email'].join(',') },
  ]);
  return {
    email,
    name,
  };
};
