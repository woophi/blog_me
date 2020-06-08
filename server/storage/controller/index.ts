import { Response, Request } from 'express-serve-static-core';
import { Storage } from '../storage';
import { HTTPStatus } from 'server/lib/models';
import { AgendaJobName } from 'server/lib/agenda/constants';

export const startUpload = (req: Request, res: Response) => {
  const storage = new Storage(req.files, AgendaJobName.processFiles);
  storage.performQueue();
  return res.sendStatus(HTTPStatus.OK);
};

export const startUploadUrl = (req: Request, res: Response) => {
  if (req.body.url) {
    const storage = new Storage(null, AgendaJobName.processFileUrl, req.body.url);
    storage.performQueue();
  } else {
    return res.sendStatus(HTTPStatus.BadRequest);
  }
  return res.sendStatus(HTTPStatus.OK);
};
