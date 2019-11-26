import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import * as controllers from './controllers';
import * as auth from './auth';
import * as identity from './identity';
import * as storage from './storage';
import { join } from 'path';
import { HTTPStatus } from './lib/models';
import { rateLimiterMiddleware } from './lib/rate-limiter';
const Agendash = require('agendash');
import { UrlWithParsedQuery } from 'url';
import Server from 'next/dist/next-server/server/next-server';
import { agenda } from './lib/agenda';

const options = {
  root: join(__dirname, '../assets')
};

export function router(
  app: express.Express,
  handle: (
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl?: UrlWithParsedQuery
  ) => Promise<void>,
  appNext: Server
) {
  app.use('/favicon.ico', (_, res) => res.status(HTTPStatus.OK).sendFile('favicon.ico', options));
  app.use('/dash', identity.authorizedForSuperAdmin, Agendash(agenda));
  app.use('/pick/:code', controllers.forwardToOriginalUrl);

  app.get('/robots.txt', (_, res) => res.status(HTTPStatus.OK).sendFile('robots.txt', options));
  app.get('/sitemap.xml', (_, res) => res.status(HTTPStatus.OK).sendFile('sitemap.xml', options));

  app.post('/api/register/:user', rateLimiterMiddleware, controllers.registerOnlyEmailOfNewUser);
  app.post('/api/register/:user/continue', rateLimiterMiddleware, controllers.registrationContinue);

  app.get('/api/profile/:user/status', rateLimiterMiddleware, identity.validateToken, controllers.getUserProfileStatus);
  app.put('/api/profile/:user/upgrade/payment', rateLimiterMiddleware, identity.validateToken, controllers.activatePaymentUserProfile);
  app.get('/api/profile/:user', rateLimiterMiddleware, identity.validateToken, controllers.getUserProfile);
  app.put('/api/profile/:user', rateLimiterMiddleware, identity.validateToken, controllers.updateUserProfileGeneralInfo);

  app.get('/api/profile/:user/cars', rateLimiterMiddleware, identity.validateToken, controllers.getUserCars);
  app.put('/api/profile/:user/cars', rateLimiterMiddleware, identity.validateToken, controllers.updateUserCar);
  app.post('/api/profile/:user/cars', rateLimiterMiddleware, identity.validateToken, controllers.createUserCar);
  app.patch('/api/profile/:user/cars', rateLimiterMiddleware, identity.validateToken, controllers.toggleUserCar);

  // contact message
  app.post('/api/guest/send/message', rateLimiterMiddleware, controllers.sendMailToAdmins);

  // pass reset
  app.post('/api/guest/password/reset', rateLimiterMiddleware, controllers.resetPassword);
  app.patch('/api/guest/password/update', controllers.updatePassword);
  // unsub
  app.get('/api/guest/unsub/state', rateLimiterMiddleware, controllers.getUnsubLinkState);
  app.put('/api/guest/unsub', rateLimiterMiddleware, controllers.guestUnsub);

  // user
  app.post('/api/app/user/login', rateLimiterMiddleware, auth.login);
  app.post('/api/app/user/logout', rateLimiterMiddleware, identity.validateToken, auth.logout);
  app.post('/api/app/user/check', auth.checkUser);

  // admin
  app.post('/api/admin/create/link', identity.authorizedForSuperAdmin, controllers.generateNewShortLink);

  app.post('/api/admin/new/user', identity.authorizedForSuperAdmin, controllers.createUser);

  app.post('/api/admin/new/language', identity.authorizedForAdmin, controllers.createNewLanguage);
  app.patch('/api/admin/toggle/language', identity.authorizedForAdmin, controllers.toggleActivationLanguage);

  app.post('/storage/upload', identity.authorizedForAdmin, storage.startUpload);

  app.get('/api/admin/fb/pages', identity.authorizedForAdmin, controllers.getFBPIds);
  app.patch('/api/admin/fb/check/token', identity.authorizedForAdmin, controllers.checkTokenValidation);

  app.patch('/api/admin/ig/check', identity.authorizedForAdmin, controllers.checkLoginInstagram);
  app.patch('/api/admin/ig/login', identity.authorizedForAdmin, controllers.verrifyLoginInstagram);
  app.patch('/api/admin/ig/code', identity.authorizedForAdmin, controllers.sendCodeInstagram);

  // facebook connect
  app.get('/setup/fb', controllers.fbLogin);
  app.get('/processLogin/fb/at', controllers.processLogin);

  app.get('/unsub/:id', (req, res) => {
    const actualPage = '/unsub/guest'
    const queryParams = { id: req.params.id }
    appNext.render(req, res, actualPage, queryParams)
  });

  app.get('/password/update/:id', (req, res) => {
    const actualPage = '/password/update'
    const queryParams = { id: req.params.id }
    appNext.render(req, res, actualPage, queryParams)
  });

  app.get('*', (req, res) => {
    return handle(req, res);
  });
}
