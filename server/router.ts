import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import * as controllers from './controllers';
import * as auth from './auth';
import * as identity from './identity';
import * as storage from './storage';
import { join } from 'path';
import { HTTPStatus } from './lib/models';
import {
  rateLimiterMiddleware,
  fetchingLimiterMiddleware,
  messageLimiterMiddleware,
} from './lib/rate-limiter';
const Agendash = require('agendash');
import { UrlWithParsedQuery } from 'url';
import Server from 'next/dist/next-server/server/next-server';
import { agenda } from './lib/agenda';
import { get, GlobalCache } from './options';
const options = {
  root: join(__dirname, '../assets'),
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
  app.use('/favicon.ico', (_, res) =>
    res.status(HTTPStatus.OK).sendFile('favicon.ico', options)
  );
  app.use('/dash', identity.authorizedForSuperAdmin, Agendash(agenda));
  app.use('/pick/:code', controllers.forwardToOriginalUrl);

  app.get('/robots.txt', (_, res) =>
    res.status(HTTPStatus.OK).sendFile('robots.txt', options)
  );
  app.get('/sitemap.xml', (_, res) =>
    res.status(HTTPStatus.OK).sendFile('sitemap.xml', options)
  );

  app.get('/contact.html', (_, res) => res.redirect('/contact'));

  app.get('/release/v', (_, res) => res.send(get(GlobalCache.ReleaseVersion)));

  // guest blogs
  app.get('/api/guest/blogs', fetchingLimiterMiddleware, controllers.getGuestBlogs);
  app.get('/api/guest/blogs/search', controllers.searchBlogs);
  app.get('/api/guest/blog', fetchingLimiterMiddleware, controllers.getGuestBlog);
  app.get(
    '/api/guest/blog/comment',
    fetchingLimiterMiddleware,
    controllers.getGuestBlogComment
  );
  app.get(
    '/api/guest/blog/comments',
    fetchingLimiterMiddleware,
    controllers.getGuestBlogComments
  );
  app.get(
    '/api/guest/blog/comment/replies',
    fetchingLimiterMiddleware,
    controllers.getGuestBlogCommentReplies
  );

  // guest quizzes
  app.get('/api/guest/quiz', fetchingLimiterMiddleware, controllers.getQuizForGuest);

  app.post(
    '/api/guest/blog/view',
    fetchingLimiterMiddleware,
    controllers.increaseBlogViews
  );

  app.get('/auth/:external/go', auth.externalLogin);
  app.get('/login/:external/complete', auth.externalLoginComplete);

  // contact message
  app.post(
    '/api/guest/send/message',
    messageLimiterMiddleware,
    controllers.sendMailToAdmins
  );

  // pass reset
  app.post(
    '/api/guest/password/reset',
    rateLimiterMiddleware,
    controllers.resetPassword
  );
  app.patch('/api/guest/password/update', controllers.updatePassword);
  // unsub
  app.get(
    '/api/app/user/unsub/state',
    fetchingLimiterMiddleware,
    controllers.getUnsubLinkState
  );
  app.put('/api/app/user/unsub', identity.authorizedForApp, controllers.userUnsub);

  // user
  app.post('/api/app/user/login', rateLimiterMiddleware, auth.login);
  app.post(
    '/api/app/user/logout',
    rateLimiterMiddleware,
    identity.authorizedForApp,
    auth.logout
  );
  app.post('/api/app/user/check', auth.checkUser);

  // me
  app.put(
    '/api/app/user/me',
    identity.authorizedForApp,
    controllers.updateUserProfile
  );
  app.get(
    '/api/app/user/me/comments',
    identity.authorizedForApp,
    controllers.getUserComments
  );
  app.get(
    '/api/app/user/me/likes',
    identity.authorizedForApp,
    controllers.getUserLikes
  );
  app.get(
    '/api/app/user/me/quizzes',
    identity.authorizedForApp,
    controllers.getUserQuizzes
  );

  app.get('/api/app/user/like', identity.authorizedForApp, controllers.getUserLike);
  app.put('/api/app/user/like', identity.authorizedForApp, controllers.setUserLike);
  app.delete(
    '/api/app/user/blog/dislike',
    identity.authorizedForApp,
    controllers.userDislike
  );

  app.post(
    '/api/app/user/comment',
    identity.authorizedForApp,
    controllers.createBlogComment
  );
  app.put(
    '/api/app/user/comment',
    identity.authorizedForApp,
    controllers.rateBlogComment
  );

  app.post('/api/app/user/quiz', identity.authorizedForApp, controllers.startQuiz);
  app.get(
    '/api/app/user/quiz/participation',
    identity.authorizedForApp,
    controllers.getQuizParticipationInfo
  );
  app.patch(
    '/api/app/user/quiz/participation',
    identity.authorizedForApp,
    controllers.setParticipantActions
  );

  // admin
  app.post(
    '/api/admin/create/link',
    identity.authorizedForSuperAdmin,
    controllers.generateNewShortLink
  );

  app.post(
    '/api/admin/create/blog',
    identity.authorizedForSuperAdmin,
    controllers.createBlog
  );
  app.get(
    '/api/admin/get/blog',
    identity.authorizedForSuperAdmin,
    controllers.getBlog
  );
  app.post(
    '/api/admin/get/blogs',
    identity.authorizedForSuperAdmin,
    controllers.getBlogs
  );
  app.put(
    '/api/admin/update/blog',
    identity.authorizedForSuperAdmin,
    controllers.updateBlog
  );
  app.delete(
    '/api/admin/delete/blogs',
    identity.authorizedForSuperAdmin,
    controllers.deleteBlogs
  );

  app.post(
    '/api/admin/new/language',
    identity.authorizedForSuperAdmin,
    controllers.createNewLanguage
  );
  app.patch(
    '/api/admin/toggle/language',
    identity.authorizedForSuperAdmin,
    controllers.toggleActivationLanguage
  );

  app.post('/storage/upload', identity.authorizedForSuperAdmin, storage.startUpload);
  app.get(
    '/api/admin/files',
    identity.authorizedForSuperAdmin,
    controllers.getAllFiles
  );
  app.post(
    '/api/admin/file',
    identity.authorizedForSuperAdmin,
    storage.startUploadUrl
  );

  app.patch(
    '/api/admin/ig/check',
    identity.authorizedForSuperAdmin,
    controllers.checkLoginInstagram
  );
  app.patch(
    '/api/admin/ig/login',
    identity.authorizedForSuperAdmin,
    controllers.verrifyLoginInstagram
  );
  app.patch(
    '/api/admin/ig/code',
    identity.authorizedForSuperAdmin,
    controllers.sendCodeInstagram
  );

  app.post(
    '/api/admin/quiz',
    identity.authorizedForSuperAdmin,
    controllers.createNewQuiz
  );
  app.put(
    '/api/admin/quiz',
    identity.authorizedForSuperAdmin,
    controllers.updateQuiz
  );
  app.delete(
    '/api/admin/quiz',
    identity.authorizedForSuperAdmin,
    controllers.deleteQuiz
  );
  app.get('/api/admin/quiz', identity.authorizedForSuperAdmin, controllers.getQuiz);
  app.get(
    '/api/admin/quizzes',
    identity.authorizedForSuperAdmin,
    controllers.getQuizzes
  );

  app.put(
    '/api/admin/quiz/questions',
    identity.authorizedForSuperAdmin,
    controllers.updateQuestions
  );
  app.get(
    '/api/admin/quiz/participants',
    identity.authorizedForSuperAdmin,
    controllers.getQuizParticipants
  );

  // friends api start
  app.get(
    '/api/admin-f/blacklist',
    identity.authorizedForAdmin,
    controllers.testfriendship.getBlackList
  );
  app.get(
    '/api/admin-f/delations',
    identity.authorizedForAdmin,
    controllers.testfriendship.getDelationList
  );
  app.get(
    '/api/admin-f/top-coins',
    identity.authorizedForAdmin,
    controllers.testfriendship.getTopCoinsList
  );
  app.get(
    '/api/admin-f/top-quizzies',
    identity.authorizedForAdmin,
    controllers.testfriendship.getTopQuizzesList
  );
  app.get(
    '/api/admin-f/user-detail',
    identity.authorizedForAdmin,
    controllers.testfriendship.getUserDetail
  );
  // friends api end

  app.get('/unsub/:id', (req, res) => {
    const actualPage = '/unsub/guest';
    const queryParams = { id: req.params.id };
    appNext.render(req, res, actualPage, queryParams);
  });

  app.get('/password/update/:id', (req, res) => {
    const actualPage = '/password/update';
    const queryParams = { id: req.params.id };
    appNext.render(req, res, actualPage, queryParams);
  });

  app.get('/post/:blogId', (req, res) => {
    const actualPage = '/blog';
    const getBlogId = req.params.blogId?.split('-').pop();
    const queryParams = { blogId: getBlogId };
    if (isNaN(Number(getBlogId))) {
      res.status(HTTPStatus.NotFound);
      return appNext.render(req, res, actualPage, queryParams);
    }
    appNext.render(req, res, actualPage, queryParams);
  });

  app.get('/quiz/:quizId', (req, res) => {
    const actualPage = '/quiz';
    const getQuizId = req.params.quizId;
    const queryParams = { quizId: getQuizId };
    if (isNaN(Number(getQuizId))) {
      res.status(HTTPStatus.NotFound);
      return appNext.render(req, res, actualPage, queryParams);
    }
    appNext.render(req, res, actualPage, queryParams);
  });

  app.get(
    '/admin/blogs/edit/:blogId',
    identity.authorizedForSuperAdmin,
    (req, res) => {
      const actualPage = '/admin/blogs/edit';
      const queryParams = { blogId: req.params.blogId };
      appNext.render(req, res, actualPage, queryParams);
    }
  );
  app.get(
    '/admin/quizzes/edit/:quizId',
    identity.authorizedForSuperAdmin,
    (req, res) => {
      const actualPage = '/admin/quizzes/edit';
      const queryParams = { quizId: req.params.quizId };
      appNext.render(req, res, actualPage, queryParams);
    }
  );

  app.get(
    '/admin/quizzes/participants/:quizId',
    identity.authorizedForSuperAdmin,
    (req, res) => {
      const actualPage = '/admin/quizzes/participants';
      const queryParams = { quizId: req.params.quizId };
      appNext.render(req, res, actualPage, queryParams);
    }
  );

  app.get(
    '/admin/friend/:vkUserId',
    identity.authorizedForAdmin,
    (req, res) => {
      const actualPage = '/admin/friend';
      const queryParams = { vkUserId: req.params.vkUserId };
      appNext.render(req, res, actualPage, queryParams);
    }
  );

  app.use('/admin/*', identity.authorizedForAdmin);
  app.use('/admin', identity.authorizedForAdmin);
  app.use('/me/*', identity.authorizedForApp);
  app.use('/me', identity.authorizedForApp);

  app.get('*', (req, res) => {
    return handle(req, res);
  });
}
