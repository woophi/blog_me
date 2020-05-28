import axios, { AxiosRequestConfig } from 'axios';
import { HTTPMethod, HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';
import { IDictionary } from 'server/lib/models';

export const callApi = async (
  method: HTTPMethod,
  url: string,
  payload: object = null
) => {
  try {
    Logger.debug('Api url ' + url);

    const payloadString = payload != null ? JSON.stringify(payload) : null;

    const rc: AxiosRequestConfig = {
      url,
      headers: {
        Accept: 'application/json',
      },
      method,
    };

    if (payloadString) {
      rc.data = payloadString;
      rc.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }

    const result: {
      data?: any;
      status: HTTPStatus;
      error?: any;
    } = await axios(rc).then(
      (r) => ({ data: r.data, status: r.status }),
      (e) => ({ status: e.response.status, error: e.response.data.error })
    );

    if (result.status === HTTPStatus.BadRequest) {
      const errMessage = result.error.message;
      if (errMessage) {
        Logger.error(errMessage);
        return {};
      }
      return {};
    }
    Logger.info(result?.status);
    return result?.data;
  } catch (error) {
    Logger.error('fetch api error', error);
    return {};
  }
};

export function buildQueryString(items: IDictionary<string>[]) {
  const joined = items
    .map((it) => {
      const key = Object.keys(it)[0];
      return `${key}=${encodeURI(it[key])}`;
    })
    .join('&');
  return joined.length > 0 ? '?' + joined : '';
}
