import * as axios from 'axios';
import { FB_API_VERSION } from './constants';
import { buildQueryString } from './helpers';
import { Logger } from '../logger';
import { HTTPMethod, IDictionary, HTTPStatus } from 'server/lib/models';

export const callApi = async (
  method: HTTPMethod,
  action: string,
  parameters: IDictionary<string>[],
  payload: object = null
) => {
  try {

    const url = `https://graph.facebook.com/${FB_API_VERSION}/${action}${buildQueryString(
      parameters
    )}`;

    Logger.debug('FB url ' + url)

    const payloadString = payload != null ? JSON.stringify(payload) : null;

    const rc: axios.AxiosRequestConfig = {
      url,
      headers: {
        Accept: 'application/json'
      },
      method
    };

    if (payloadString) {
      rc.data = payloadString;
      rc.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }

    const result: {
      data?: any;
      status: HTTPStatus;
      error?: any;
    } = await axios
      .default(rc)
      .then(
        r => ({ data: r.data, status: r.status }),
        e => ({ status: e.response.status, error: e.response.data.error })
      );

    if (result.status === HTTPStatus.BadRequest) {
      const errMessage = result.error.message;
      if (errMessage) {
        Logger.error(errMessage);
        return {};
      }
    }
    return result.data;
  } catch (error) {
    Logger.error('Fb fetch api error', error);
    return {};
  }
};
