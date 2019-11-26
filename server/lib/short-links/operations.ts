import ShortLinks from 'server/models/shortLinks';
import { ShortLinksModel } from 'server/models/types';
import { generateRandomString } from 'server/utils/prgn';
import { Logger } from 'server/logger';
import config from 'server/config';

export const createShortLink = async (originalUrl: string) => {
  try {
    const uniqStringId = await enusureUniqStringId(4);
    const newLink = await new ShortLinks({
        originalUrl,
        shortUrl: `${config.SITE_URI}pick/${uniqStringId}`,
        urlCode: uniqStringId
    } as ShortLinksModel).save();
    return newLink.shortUrl;
  } catch (error) {
    Logger.error(error);
    return '';
  }
};

const enusureUniqStringId = async (length: number): Promise<string> => {
  const code = generateRandomString(length);
  const exists = await ShortLinks.findOne()
    .where('urlCode', code)
    .exec();
  if (exists) {
    return await enusureUniqStringId(length);
  }
  return code;
};
