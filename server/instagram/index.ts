import { IgApiClient } from 'instagram-private-api';
import { EventBus, BusEvents } from '../lib/events';
import { Logger } from '../logger';
import config from '../config';
import { IgEventParams } from './types';
import { getBlogCaptionData } from 'server/operations';
const Jimp = require('jimp');

export const ig = new IgApiClient();
const loginToIg = async () => {
  try {
    Logger.debug('Instagram generate device');
    ig.state.generateDevice(config.IG_USERNAME);

    Logger.debug('Instagram login');
    await ig.simulate.preLoginFlow();
    await ig.account.login(config.IG_USERNAME, config.IG_PASSWORD);

    process.nextTick(async () => await ig.simulate.postLoginFlow());

    return ig;
  } catch (error) {
    Logger.error(error);
    return null;
  }
};

export const postToInstagram = async ({ blogId, done }: IgEventParams) => {
  try {
    const { coverPhotoUrl, title } = await getBlogCaptionData(blogId);
    const ig = await loginToIg();
    if (!ig) throw Error('failed login to instagram');

    const jimpInit = await Jimp.read(coverPhotoUrl);
    jimpInit.contain(igPerfectResolution, igPerfectResolution, async (e, v) => {
      if (e) {
        Logger.info(e);
        throw Error('something went wrong with jimp contain');
      }
      Logger.debug('trying to get buff');
      const buffData = await v.getBufferAsync('image/jpeg');
      Logger.debug('got buff');
      await ig.publish.photo({
        file: buffData,
        caption: title
      });
      Logger.debug('ig photo published');
    });
  } catch (error) {
    Logger.error(error);
  }
  if (done) {
    return done();
  }
};

export const registerInstagramEvents = () => {
  Logger.debug('Register Instagram Events');
  EventBus.on(BusEvents.NEW_BLOG, postToInstagram);
};

const igPerfectResolution = 1080;
