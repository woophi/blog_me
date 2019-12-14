import config from 'server/config';
import * as fs from 'fs';
import { join } from 'path';

export const ensureViews = async () => {
  if (config.DEV_MODE) return;

  if (!fs.existsSync(join(__dirname, 'layouts'))) {
    fs.mkdirSync(join(__dirname, 'layouts'));
    try {
      fs.appendFileSync(join(__dirname, 'layouts/main.hbs'), '');
      fs.copyFileSync(
        join(__dirname, '../../server/views/layouts/main.hbs'),
        join(__dirname, 'layouts/main.hbs')
      );
      fs.appendFileSync(join(__dirname, 'finishAuth.hbs'), '');

      fs.copyFileSync(
        join(__dirname, '../../server/views/finishAuth.hbs'),
        join(__dirname, 'finishAuth.hbs')
      );
      console.dir('views copied');
    } catch (error) {
      console.dir(error);
    }
  }
};

ensureViews();
