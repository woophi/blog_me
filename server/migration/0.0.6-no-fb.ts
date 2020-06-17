import { connection } from 'mongoose';
import { SchemaNames } from 'server/models/types';

const dropFBCollection = (done) => {
  connection.dropCollection(SchemaNames.FB_PAGES, (err) => {
    if (err) {
      return done(err);
    }

    return done();
  });
};

module.exports = dropFBCollection;
