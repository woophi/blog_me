import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Logger } from 'server/logger';
import { HTTPStatus } from 'server/lib/models';
import { createShortLink } from 'server/lib/short-links';
import ShortLinks from 'server/models/shortLinks';
import * as formator from 'server/formator';
import { checkUrl } from 'server/validator';

export const generateNewShortLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const originalUrl = formator.formatString(req.body.originalUrl);

    if (!originalUrl || !(await checkUrl(originalUrl))) {
      return res.sendStatus(HTTPStatus.BadRequest);
    }

    const { link } = await createShortLink(originalUrl);

    return res
      .send({
        link
      })
      .status(HTTPStatus.OK);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.Empty);
  }
};

export const forwardToOriginalUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const urlCode = formator.formatString(req.params.code);

    if (!urlCode) {
      return res.sendStatus(HTTPStatus.BadRequest);
    }

    const shortLink = await ShortLinks.findOne({
      urlCode
    }).exec();

    if (!shortLink) {
      return res.sendStatus(HTTPStatus.NotFound);
    }

    return res.redirect(shortLink.originalUrl);
  } catch (error) {
    Logger.error(error);
    return res.sendStatus(HTTPStatus.Empty);
  }
};
