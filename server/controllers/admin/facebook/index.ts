import { Request, Response, NextFunction } from 'express';
import config from 'server/config';
import * as FB from 'server/facebook';
import * as async from 'async';
import * as kia from 'server/validator';
import { HTTPStatus } from 'server/lib/models';
import { Logger } from 'server/logger';
import { formatString, formatNumber } from 'server/formator';

export const fbLogin = async (req: Request, res: Response, next: NextFunction) => {
  return res.redirect(
    FB.getLoginUrl(config.SITE_URI + 'processLogin/fb/at', false, [
      'manage_pages',
      'email',
      'publish_pages'
    ])
  );
};

export const processLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query['code'] || '';
  const accessToken = await FB.getAccessToken(
    formatString(code),
    'processLogin/fb/at'
  );
  const pages = await FB.getPagesData(accessToken);
  if (req.session.user) {
    async.forEach(pages, FB.subscribePage);
  }

  return res.redirect('/admin/facebook');
};

export const checkTokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageId = formatNumber(req.body.pageId);
  const validator = new kia.Validator(req, res, next);

  await validator.check(
    {
      pageId: validator.required
    },
    { pageId }
  );
  try {
    const valid = await FB.validateLongLivedToken(pageId);
    return res.send({ valid }).status(HTTPStatus.OK);
  } catch (error) {
    Logger.error('validateLongLivedToken', error);
    return res.send({ valid: false }).status(HTTPStatus.OK);
  }
};
export const getFBPIds = async (req: Request, res: Response, next: NextFunction) => {
  const ids = await FB.getFacebookPageIds();
  return res.send(ids).status(HTTPStatus.OK);
};
