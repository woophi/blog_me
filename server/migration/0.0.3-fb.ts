import UserModel from '../models/users';
import { Logger } from '../logger';
import * as identity from '../identity';
import * as async from 'async';
import { Locales } from 'server/models/types';
import { getLanguageIdByLocaleId } from 'server/operations';

const createFbTestUser = done => {
  if (!process.env.FB_ADMIN_MAIL && !process.env.FB_ADMIN_PASS) {
    Logger.debug('no fb test account provided');
    return done();
  }
  const userData = {
    email: process.env.FB_ADMIN_MAIL,
    name: 'fb_test_account',
    password: process.env.FB_ADMIN_PASS,
    roles: [identity.ROLES.GODLIKE]
  };
  async.series(
    [
      cb => {
        Logger.debug(`trying to find existing user`);

        UserModel.findOne({ email: userData.email.toLowerCase() })
          .lean()
          .exec((err, user) => {
            if (err) {
              Logger.error(err);
              return cb(err);
            }
            if (user) {
              Logger.debug('admin exists');
              return cb(Error('exists'));
            }
            return cb();
          });
      }
    ],
    async err => {
      if (err) {
        return done();
      }
      const hashing = new identity.Hashing();
      Logger.debug(
        `creating hash for new user password ${new Date().toLocaleTimeString()}`
      );

      try {
        userData.password = await hashing.hashPassword(userData.password);
      } catch (e) {
        new Error(e);
        return done(e);
      }

      Logger.debug(
        `created hash for new user password ${new Date().toLocaleTimeString()}`
      );
      const language = await getLanguageIdByLocaleId(Locales.EN);
      const newUser = new UserModel({
        ...userData,
        language
      });
      return newUser.save(err => {
        if (err) {
          Logger.error('err to save new user ' + err);
          return done(err);
        }
        Logger.debug('new user saved');
        return done();
      });
    }
  );
};

module.exports = done => createFbTestUser(done);
