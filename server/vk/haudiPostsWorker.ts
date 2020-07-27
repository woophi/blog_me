import { agenda } from 'server/lib/agenda';
import { callApi, buildQueryString } from 'server/utils/api';
import config from 'server/config';
import async from 'async';
import VkGroupPostM from 'server/models/vkGroupPosts';
import { sendeNotificationEmailAboutHaudiPost } from './operations';
import { AgendaJobName } from 'server/lib/agenda/constants';

agenda.define(AgendaJobName.fetchHaudiPosts, async () => {
  const posts = await getHaydiGroupPosts(config.VK_SERVICE);

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
});

agenda.define(AgendaJobName.checkVkPostToNotify, async () => {
  const postsToNotify = await VkGroupPostM.find({
    needToBeNotified: true,
    notified: false,
  }).lean();

  await async.forEach(postsToNotify, async (post) => {
    await sendeNotificationEmailAboutHaudiPost(post.postId);
  });
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

const words = config.DEV_MODE
  ? []
  : [
      'react',
      'redux',
      'node',
      'node.js',
      'nodejs',
      'реакт',
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
      'наставник',
      'ментор',
      'ts',
      'sitemap',
      'деньг',
      'вк мини апп',
      'vk mini app',
      'nestjs',
      'digitalocean',
    ];

const checkPostTextForNeededInfo = (text: string) => {
  return !!words.find(
    (word) => text.toLowerCase().indexOf(word.toLowerCase()) !== -1
  );
};
