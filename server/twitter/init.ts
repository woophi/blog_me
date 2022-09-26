import config from 'server/config';
import { TwitterClient } from 'twitter-api-client';

export const twitterClient = new TwitterClient({
  apiKey: config.TW_API_KEY ?? '',
  apiSecret: config.TW_API_SECRET ?? '',
  accessToken: config.TW_ACCESS_TOKEN,
  accessTokenSecret: config.TW_ACCESS_TOKEN_SECRET,
});

