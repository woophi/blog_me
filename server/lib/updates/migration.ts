import * as R from 'ramda';
import * as async from 'async';
import * as fs from 'fs';
import mongoose from 'mongoose';
import * as path from 'path';
import * as semver from 'semver';
import config from '../../config';
import { SchemaNames } from '../../models/types';

const _dashes_ = '------------------------------------------------';

const UpdateModel = new mongoose.Schema({
	key: { type: String, index: true },
	appliedOn: { type: Date, default: Date.now },
});
mongoose.model(SchemaNames.MIGRATIONS, UpdateModel);

const Update = mongoose.model(SchemaNames.MIGRATIONS);

let updatesPath = path.resolve(__dirname, '../../migration');

if (!fs.existsSync(updatesPath)) {
  console.warn('updatesPath not exist');
  process.exit();
}

var updates = fs.readdirSync(updatesPath)
  .map((i) => {
    const setExt = config.DEV_MODE ? '.ts' : '.js';
    return (path.extname(i) !== setExt && path.extname(i) !== '.coffee') ? false : path.basename(i, setExt);
  }).filter((i) => {
    // exclude falsy values and filenames that without a valid semver
    return i && semver.valid(i.split('-')[0]);
  }).sort((a: string, b: string) => {
    // exclude anything after a hyphen from the version number
    return semver.compare(a.split('-')[0], b.split('-')[0]);
  });

export const createMigration = (file, done) => {
  Update
    .findOne()
    .where('key', file)
    .exec((err, updateRecord) => {
      if (err) {
				console.error('Error searching database for update ' + file + ':');
				console.dir(err);
			  return done(err);
      }
      if (!updateRecord) {
        console.log(_dashes_ + '\nApplying update ' + file + '...');
        let update = require(path.join(updatesPath, file));
        if (!update) {
					return done();
        }
        if (R.is(Object, update.create)) {
          const items = update.create;
          const itemsKeys = Object.keys(items);

          itemsKeys.forEach(key => {
            const newModel = mongoose.model(key);
            const giveMeDatas = items[key] as any[];
            giveMeDatas.forEach(data => {
              new newModel(data).save(err => {
                if (err) {
                  console.error('\n' + _dashes_,
									'\n' + ': Update ' + file  + ' failed with errors:',
									'\n' + err,
                  '\n');
                  process.nextTick(function () {
                    done(err);
                  });
                }
              });
            });

          });
          new Update({ key: file }).save(done);
        } else {
          update((err) => {
            if (!err) {
              new Update({ key: file }).save(done);
            } else {
              done(err);
            }
          });
        }

      } else {
        done();
      }
    })
}
export const applyMigration = () =>
  async.eachSeries(updates, createMigration, (err) => {
    if (err) {
      console.warn(_dashes_);
      console.error(err)
    }
    console.dir(_dashes_);
    console.dir('Check for updates finished');
  })
