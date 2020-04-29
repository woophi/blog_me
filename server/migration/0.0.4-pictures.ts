import BlogModel from '../models/blogs';
import * as async from 'async';
import { parse } from 'path';
import { Logger } from 'server/logger';

const updateImgLinksForPreview = done => {
  async.series(
    [],
    async err => {
      if (err) {
        return done(err);
      }
      const blogs = await BlogModel.find();
      async.forEach(blogs, b => {
        const urlData = parse(b.coverPhotoUrl);
        if (urlData.ext) {
          b.coverPhotoUrl = b.coverPhotoUrl.substring(0, b.coverPhotoUrl.indexOf(urlData.ext));
          Logger.debug('new url', b.coverPhotoUrl);
          b.save();
        }
      });
      return done();
    }
  );
};

module.exports = done => updateImgLinksForPreview(done);
