import { HTTPStatus } from 'server/lib/models';
import { callApi } from 'server/utils/api';
import config from '../../../config';
import { Request, Response } from 'express-serve-static-core';

const getBlackList = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/blacklist`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};

export const testfriendship = {
  getBlackList,
};
