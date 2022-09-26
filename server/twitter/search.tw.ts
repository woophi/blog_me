import { Request, Response } from 'express-serve-static-core';
import { twitterClient } from './init';

export const searchTwitts = async (req: Request, res: Response) => {
  const q = req.query['query'];
  const lang = req.query['lang'];

  try {
    const r = await twitterClient.tweets.search({
      q,
      count: 5,
      lang,
      result_type: 'popular',
    });
    return res.send(
      r.statuses.map((t) => ({
        avatar: t.user.profile_background_image_url_https,
        createdAt: t.created_at,
        hastags: t.entities.hashtags.map((h) => h.text),
        id: t.id_str,
        text: t.text,
        fullText: t.full_text,
        truncated: t.truncated,
        urls: t.entities.urls.map((u) => u.url),
        userMentions: t.entities.user_mentions.map((m) => ({
          screenName: m.screen_name,
          id: m.id_str,
        })),
        userName: t.user.screen_name,
        source: `https://twitter.com/${t.user.screen_name}/status/${t.id_str}`,
      }))
    );
  } catch (error) {
    console.error(error);
    return res.send([]);
  }
};

