import { IgApiClient } from 'instagram-private-api';
import { Logger } from '../logger';
import config from '../config';
import { getBlogCaptionData, blogRelativeUrl } from 'server/operations';
import { NewBlogEventParams } from 'server/lib/events';
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

export const postToInstagram = async ({ blogId, done }: NewBlogEventParams) => {
  try {
    const { coverPhotoUrl, title, shortText } = await getBlogCaptionData(blogId);
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
        caption: `${title} ${shortText} ${blogRelativeUrl(blogId, title)}`
      });
      Logger.debug('ig photo published');

      const currentUser = await ig.account.currentUser();
      Logger.debug('ig get current account data');
      await ig.account.editProfile({
        biography: currentUser.biography,
        email: currentUser.email,
        external_url: blogRelativeUrl(blogId, title),
        first_name: currentUser.full_name,
        gender: currentUser.gender.toString(),
        phone_number: currentUser.phone_number,
        username: currentUser.username
      });
      Logger.debug('ig update current account data external_url');

    });
  } catch (error) {
    Logger.error(error);
    if (done) {
      return done(error);
    }
  }
  if (done) {
    return done();
  }
};

const igPerfectResolution = 1080;
