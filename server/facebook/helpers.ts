import { FB_API_VERSION } from './constants';
import config from '../config';
import { IDictionary } from 'server/lib/models';

export const getLoginUrl = (
  redirectUrl: string,
  isMobile: boolean,
  scopes: string[]
) => {
  const url = (
    `${isMobile ? 'https://m.facebook.com/' : 'https://www.facebook.com/'}${FB_API_VERSION}/dialog/oauth${buildQueryString([
      { client_id: config.FB_APP_ID },
      { redirect_uri: redirectUrl },
      { response_type: 'code' },
      { scope: scopes.join(',') },
      { state: '{}' }
    ])}`
  );
  return url;
};

export function buildQueryString(items: IDictionary<string>[]) {
  const joined = items
    .map(it => {
      const key = Object.keys(it)[0];
      return `${key}=${encodeURI(it[key])}`;
    })
    .join('&');
  return joined.length > 0 ? '?' + joined : '';
}
