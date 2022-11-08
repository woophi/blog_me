import { callApi } from 'server/utils/api';
import { Request, Response } from 'express-serve-static-core';
import { HTTPStatus } from 'server/lib/models';

export const proxyMovieRequest = async (req: Request, res: Response) => {
  const url = req.body['url'];

  const result = await callApi('get', url);
  return res.send(result).status(HTTPStatus.OK);
};

