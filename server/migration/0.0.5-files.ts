import FileModel from '../models/files';
import * as async from 'async';
import { parse } from 'path';
import { Logger } from 'server/logger';

const updateFiles = done => {
  async.series(
    [],
    async err => {
      if (err) {
        return done(err);
      }
      const files = await FileModel.find();
      async.forEach(files, f => {
        const urlData = parse(f.url);
        if (urlData.ext) {
          f.format = urlData.ext;
          Logger.debug('new file format', f.format);
          f.save();
        }
      });
      return done();
    }
  );
};

module.exports = done => updateFiles(done);
