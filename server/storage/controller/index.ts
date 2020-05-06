import { Response, Request } from 'express-serve-static-core';
import { Storage } from '..';
import { HTTPStatus } from 'server/lib/models';

export const startUpload = (req: Request, res: Response) => {
  const storage = new Storage(req.files, 'process files');
  storage.performQueue();
  return res.sendStatus(HTTPStatus.OK);
};

export const startUploadUrl = (req: Request, res: Response) => {
  if (req.body.url) {
    const storage = new Storage(null, 'process file url', req.body.url);
    storage.performQueue();
  } else {
    return res.sendStatus(HTTPStatus.BadRequest);
  }
  return res.sendStatus(HTTPStatus.OK);
};
