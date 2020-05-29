import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import * as controllers from './controllers';
import * as auth from './auth';
import * as identity from './identity';
import * as storage from './storage';
import { join } from 'path';
import { HTTPStatus } from './lib/models';
import { rateLimiterMiddleware, fetchingLimiterMiddleware, messageLimiterMiddleware } from './lib/rate-limiter';
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
  
  app.get('/contact.html', (_, res) => res.redirect('/contact'));

  // guest blogs
  app.get('/api/guest/blogs', fetchingLimiterMiddleware, controllers.getGuestBlogs);
  app.get('/api/guest/blogs/search', controllers.searchBlogs);
  app.get('/api/guest/blog', fetchingLimiterMiddleware, controllers.getGuestBlog);
  app.get('/api/guest/blog/comment', fetchingLimiterMiddleware, controllers.getGuestBlogComment);
  app.get('/api/guest/blog/comments', fetchingLimiterMiddleware, controllers.getGuestBlogComments);
  app.get('/api/guest/blog/comment/replies', fetchingLimiterMiddleware, controllers.getGuestBlogCommentReplies);

  app.post('/api/guest/blog/like', fetchingLimiterMiddleware, controllers.guestLikeBlog);
  app.post('/api/guest/blog/view', fetchingLimiterMiddleware, controllers.increaseBlogViews);

  app.get('/auth/:external/go', auth.externalLogin);
  app.get('/login/:external/complete', auth.externalLoginComplete);

  // contact message
  app.post('/api/guest/send/message', messageLimiterMiddleware, controllers.sendMailToAdmins);

  // pass reset
  app.post('/api/guest/password/reset', rateLimiterMiddleware, controllers.resetPassword);
  app.patch('/api/guest/password/update', controllers.updatePassword);
  // unsub
  app.get('/api/app/user/unsub/state', fetchingLimiterMiddleware, controllers.getUnsubLinkState);
  app.put('/api/app/user/unsub', identity.authorizedForApp, controllers.userUnsub);

  // user
  app.post('/api/app/user/login', rateLimiterMiddleware, auth.login);
  app.post('/api/app/user/logout', rateLimiterMiddleware, identity.authorizedForApp, auth.logout);
  app.post('/api/app/user/check', auth.checkUser);

  app.get('/api/app/user/like', identity.authorizedForApp, controllers.getUserLike);
  app.delete('/api/app/user/blog/dislike', identity.authorizedForApp, controllers.userDislike);

  app.get('/api/app/user/comments', identity.authorizedForApp, controllers.getBlogComments);
  app.post('/api/app/user/comment', identity.authorizedForApp, controllers.createBlogComment);
  app.put('/api/app/user/comment', identity.authorizedForApp, controllers.rateBlogComment);

  // admin
  app.post('/api/admin/create/link', identity.authorizedForSuperAdmin, controllers.generateNewShortLink);

  app.post('/api/admin/create/blog', identity.authorizedForAdmin, controllers.createBlog);
  app.get('/api/admin/get/blog', identity.authorizedForAdmin, controllers.getBlog);
  app.post('/api/admin/get/blogs', identity.authorizedForAdmin, controllers.getBlogs);
  app.put('/api/admin/update/blog', identity.authorizedForAdmin, controllers.updateBlog);
  app.delete('/api/admin/delete/blogs', identity.authorizedForAdmin, controllers.deleteBlogs);

  app.post('/api/admin/new/language', identity.authorizedForAdmin, controllers.createNewLanguage);
  app.patch('/api/admin/toggle/language', identity.authorizedForAdmin, controllers.toggleActivationLanguage);

  app.post('/storage/upload', identity.authorizedForAdmin, storage.startUpload);
  app.get('/api/admin/files', identity.authorizedForAdmin, controllers.getAllFiles);
  app.post('/api/admin/file', identity.authorizedForAdmin, storage.startUploadUrl);

  app.get('/api/admin/fb/pages', identity.authorizedForAdmin, controllers.getFBPIds);
  app.get('/api/admin/fb/pages/full', identity.authorizedForAdmin, controllers.getFBPages);
  app.patch('/api/admin/fb/check/token', identity.authorizedForAdmin, controllers.checkTokenValidation);

  app.patch('/api/admin/ig/check', identity.authorizedForAdmin, controllers.checkLoginInstagram);
  app.patch('/api/admin/ig/login', identity.authorizedForAdmin, controllers.verrifyLoginInstagram);
  app.patch('/api/admin/ig/code', identity.authorizedForAdmin, controllers.sendCodeInstagram);

  app.post('/api/admin/quiz', identity.authorizedForAdmin, controllers.createNewQuiz);
  app.put('/api/admin/quiz', identity.authorizedForAdmin, controllers.updateQuiz);
  app.patch('/api/admin/quiz', identity.authorizedForAdmin, controllers.updateQuizWithQuestions);
  app.delete('/api/admin/quiz', identity.authorizedForAdmin, controllers.deleteQuiz);
  app.get('/api/admin/quiz', identity.authorizedForAdmin, controllers.getQuiz);
  app.get('/api/admin/quizzes', identity.authorizedForAdmin, controllers.getQuizzes);
  
  app.get('/api/admin/quiz/questions', identity.authorizedForAdmin, controllers.getQuestions);
  app.get('/api/admin/quiz/question', identity.authorizedForAdmin, controllers.getQuestion);
  app.put('/api/admin/quiz/questions', identity.authorizedForAdmin, controllers.updateQuestions);

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

  app.get('/admin/blogs/edit/:blogId', identity.authorizedForAdmin, (req, res) => {
    const actualPage = '/admin/blogs/edit';
    const queryParams = { blogId: req.params.blogId };
    appNext.render(req, res, actualPage, queryParams);
  });
  app.get('/admin/quizzes/edit/:quizId', identity.authorizedForAdmin, (req, res) => {
    const actualPage = '/admin/quizzes/edit';
    const queryParams = { quizId: req.params.quizId };
    appNext.render(req, res, actualPage, queryParams);
  });

  app.use('/admin/*', identity.authorizedForAdmin);
  app.use('/admin', identity.authorizedForAdmin);

  app.get('*', (req, res) => {
    return handle(req, res);
  });
}
