import * as dns from 'dns';
import * as util from 'util';
import { Logger } from 'server/logger';

export const checkUrl = async (url: string) => {
  try {
    const host = extractHostname(url);
    if (!host) return false;
    Logger.info('start checking hostname', host);

    const lookUpAddress = await util.promisify(dns.lookup)(host);
    if (!lookUpAddress || !lookUpAddress.address) return false;
    Logger.info('resolved address', lookUpAddress);
    return true;
  } catch (error) {
    Logger.error(error);
    return false;
  }
};

const extractHostname = (url: string) => {
  let hostname: string = '';

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};
