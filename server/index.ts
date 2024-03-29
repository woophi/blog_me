import './moduleResolver';
if (!process.env.NO_DV) {
  const dotenv = require('dotenv');
  const result = dotenv.config({ debug: true });
  if (result.error) {
    throw result.error;
  }
}
import config from './config';
import { checkConfiguration } from './utils/helpers/config';

checkConfiguration(config);

import * as fs from 'fs';
import { join } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createServer } from 'http';
import compression from 'compression';

import { registerSocket } from './lib/sockets';
import { router } from './router';
import { initExpressSession } from './identity';
import fileUpload from 'express-fileupload';
import handlebars from 'express-handlebars';
import { applyMigration } from './lib/updates';
import next from 'next';
import { connection } from './lib/db';
import { agenda } from './lib/agenda';
import { generateSiteMap } from './utils/helpers/sitemap';
import { setReleaseVersion } from './heroku';
import { NextHandleFunction } from './lib/models';
import('./views');

const appNext = next({ dev: config.DEV_MODE });
const handle = appNext.getRequestHandler();

appNext.prepare().then(async () => {
  await connection;
  const appExpress = express();
  appExpress.use(compression({ filter: shouldCompress }) as NextHandleFunction);
  appExpress.use(bodyParser.urlencoded({ extended: true }));
  appExpress.use(bodyParser.json());
  appExpress.use(fileUpload() as NextHandleFunction);
  if (config.DEV_MODE) {
    appExpress.use(logger('dev') as NextHandleFunction);
  } else {
    appExpress.use(
      helmet({
        contentSecurityPolicy: false,
      }) as NextHandleFunction
    );
    appExpress.disable('x-powered-by');
    appExpress.use(logger('tiny') as NextHandleFunction);
    appExpress.set('trust proxy', 1);
  }
  appExpress.use(cookieParser(config.COOKIE_SECRET) as NextHandleFunction);
  appExpress.use(initExpressSession() as NextHandleFunction);

  appExpress.engine(
    '.hbs',
    handlebars({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: 'server/views/layouts',
      partialsDir: 'server/views/partials',
    })
  );
  appExpress.set('views', join(__dirname, 'views'));
  appExpress.set('view engine', '.hbs');
  // serve locales for client
  appExpress.use('/locales', express.static(join(__dirname, '../locales')));
  if (!fs.existsSync(join(__dirname, 'storage/temp'))) {
    fs.mkdirSync(join(__dirname, 'storage/temp'));
  }
  router(appExpress, handle, appNext);

  const server = createServer(appExpress);
  registerSocket(server);

  applyMigration();
  generateSiteMap();
  setReleaseVersion();
  server.listen(config.PORT_CORE, () => {
    console.log(`> Ready on http://localhost:${config.PORT_CORE}`);
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

    console.log(`Listening on ${bind}`);
  });

  server.on('error', (err: any) => {
    if (err.syscall !== 'listen') throw err;

    const bind =
      typeof config.PORT_CORE === 'string'
        ? `Pipe ${config.PORT_CORE}`
        : `Port ${config.PORT_CORE}`;

    switch (err.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
      default:
        throw err;
    }
  });
});

process.on('uncaughtException', async (err) => {
  console.error(err);
  await agenda.stop();
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
});

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
