import { SitemapStream } from 'sitemap';
import { Logger } from 'server/logger';
import config from 'server/config';
import BlogModel from 'server/models/blogs';
import { createWriteStream } from 'fs';

export const generateSiteMap = async () => {
  try {
    Logger.info('[Sitemap] start to generate sitemap');

    const smStream = new SitemapStream({ hostname: config.SITE_URI });

    const writeStream = createWriteStream(
      __dirname + '../../../../assets/sitemap.xml'
    );

    smStream.pipe(writeStream);

    smStream.write({
      url: '',
      changefreq: 'weekly',
    });
    smStream.write({
      url: '/contact',
    });

    const blogs = await BlogModel.find()
      .where('deleted', null)
      .sort('createdAt')
      .exec();

    Logger.info('[Sitemap] amount of blogs is', blogs.length);

    blogs.forEach((blog) => {
      const mapTitle = blog.title.toLowerCase().split(' ').join('-');

      smStream.write({
        url: `/post/${mapTitle}-${blog.blogId}`,
        changefreq: 'monthly',
        lastmod: blog.updatedDate,
      });
    });

    smStream.end(() => {
      Logger.info('[Sitemap] finished to generate sitemap');
    });
  } catch (error) {
    Logger.error('[Sitemap] Error to generate sitemap', JSON.stringify(error));
  }
};
