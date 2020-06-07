import { agenda } from 'server/lib/agenda';
import { callApi, buildQueryString } from 'server/utils/api';
import { Logger } from 'server/logger';
import config from 'server/config';
import async from 'async';
import VkGroupPostM from 'server/models/vkGroupPosts';
import { sendeNotificationEmailAboutHaudiPost } from './operations';

agenda.define('fetchHaudiPosts', async () => {
  const posts = await getHaydiGroupPosts(config.VK_SERVICE);

  Logger.info('[VkWorker] I got haudi posts!');

  await async.forEach(posts, async (post) => {
    const existingPost =
      (await VkGroupPostM.findOne({ postId: post.id }).countDocuments()) > 0;

    if (!existingPost) {
      const shouldNotify = checkPostTextForNeededInfo(post.text || '');
      await new VkGroupPostM({
        postId: post.id,
        postUrl: post.link,
        needToBeNotified: shouldNotify,
        text: post.text,
      }).save();
    }
  });
  Logger.info('[VkWorker] fetchHaudiPosts finished!');
});

agenda.define('checkVkPostToNotify', async () => {
  Logger.info('[VkPostWorker] Start to check');

  const postsToNotify = await VkGroupPostM.find({
    needToBeNotified: true,
    notified: false,
  }).lean();

  await async.forEach(postsToNotify, async (post) => {
    await sendeNotificationEmailAboutHaudiPost(post.postId);
  });

  Logger.info('[VkPostWorker] checkVkPostToNotify finished');
});

type PostItem = {
  id: number;
  ownerId: number;
  date: number;
  text: string;
  link: string;
};

const getHaydiGroupPosts = async (accessToken: string): Promise<PostItem[]> => {
  const data = await callApi(
    'post',
    `https://api.vk.com/method/wall.get${buildQueryString([
      { access_token: accessToken },
      { domain: 'howdyho_net' },
      { offset: '1' },
      { filter: 'others' },
    ])}&v=5.103`
  );

  const posts = data.response?.items?.map((it) => ({
    id: it.id,
    ownerId: it.owner_id,
    date: it.date,
    text: it.text,
    link: `https://vk.com/howdyho_net?w=wall${it.owner_id}_${it.id}`,
  }));

  return posts;
};

const words = [
  'react',
  'redux',
  'node',
  'node.js',
  'nodejs',
  'реакт',
  'помоги',
  'next',
  'next.js',
  'heroku',
  'cloudflare',
  'mongodb',
  'mongoose',
  'js',
  'javaScript',
  'typeScript',
  'c#',
  'хелп',
  'наставник',
  'ментор',
  'ts',
  'sitemap',
  'деньг',
];

const checkPostTextForNeededInfo = (text: string) => {
  return words.find((word) => text.toLowerCase().indexOf(word.toLowerCase()) !== -1);
};
