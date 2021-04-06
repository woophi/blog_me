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
const getDelationList = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/delations`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};
const getTopCoinsList = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/top-coins`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};
const getTopQuizzesList = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/top-quizzies`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};

export const testfriendship = {
  getBlackList,
  getDelationList,
  getTopCoinsList,
  getTopQuizzesList
};
