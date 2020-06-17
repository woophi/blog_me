import axios, { AxiosRequestConfig } from 'axios';
import { HTTPMethod } from 'server/lib/models';
import { Logger } from 'server/logger';
import config from 'server/config';
import { set, GlobalCache } from 'server/options';

export const callApi = async (method: HTTPMethod, url: string) => {
  try {
    const rc: AxiosRequestConfig = {
      url,
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${config.HEROKU_TOKEN}`,
      },
      method,
    };

    const result: {
      data?: any;
      error?: any;
    } = await axios(rc).then(
      (r) => ({ data: r.data }),
      (e) => ({ status: e.response.status, error: e.response.data.error })
    );

    return result?.data;
  } catch (error) {
    Logger.error('fetch heroku api error', error);
    return {};
  }
};

export const setReleaseVersion = async () => {
  const data = await callApi(
    'get',
    `https://api.heroku.com/apps/${config.HEROKU_APP_NAME}/releases`
  );

  const version = data?.find((release) => !!release?.current)?.version;

  if (version) {
    set(GlobalCache.ReleaseVersion, `1.${version}`);
  }
};
