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
const getPublicApis = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/public-tokens`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};
const getTopQuizzesList = async (req: Request, res: Response) => {
  const result = await callApi(
    'get',
    `${config.FRIENDS_URL}api/admin/top-quizzies`,
    {
      apiKey: config.FRIENDS_API_KEY,
    }
  );
  const list = result?.data ?? [];
  return res.send(list).status(HTTPStatus.OK);
};
const getUserDetail = async (req: Request, res: Response) => {
  const result = await callApi(
    'get',
    `${config.FRIENDS_URL}api/admin/detail?userId=${req.query.vkUserId}`,
    {
      apiKey: config.FRIENDS_API_KEY,
    }
  );
  const detail = result?.data ?? {};
  return res.send(detail).status(HTTPStatus.OK);
};

const banUser = async (req: Request, res: Response) => {
  await callApi(
    'post',
    `${config.FRIENDS_URL}api/admin/ban?vk_user_id=${req.session.vkUserId}`,
    {
      apiKey: config.FRIENDS_API_KEY,
      vkUserId: req.body.vkUserId,
      reason: req.body.reason,
      until: req.body.until,
    }
  );
  return res.sendStatus(HTTPStatus.OK);
};
const unbanUser = async (req: Request, res: Response) => {
  await callApi('delete', `${config.FRIENDS_URL}api/admin/ban`, {
    apiKey: config.FRIENDS_API_KEY,
    vkUserId: req.body.vkUserId,
    reason: req.body.reason,
  });
  return res.sendStatus(HTTPStatus.OK);
};

const startSeason = async (req: Request, res: Response) => {
  await callApi('post', `${config.FRIENDS_URL}api/admin/season`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  return res.sendStatus(HTTPStatus.OK);
};
const stopSeason = async (req: Request, res: Response) => {
  await callApi('delete', `${config.FRIENDS_URL}api/admin/season`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  return res.sendStatus(HTTPStatus.OK);
};
const getSeason = async (req: Request, res: Response) => {
  const result = await callApi('get', `${config.FRIENDS_URL}api/admin/season`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  const detail = result?.data ?? {};
  return res.send(detail).status(HTTPStatus.OK);
};
const putSeasonParticipants = async (req: Request, res: Response) => {
  await callApi('put', `${config.FRIENDS_URL}api/admin/season`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  return res.sendStatus(HTTPStatus.OK);
};
const createPublicApi = async (req: Request, res: Response) => {
  await callApi('post', `${config.FRIENDS_URL}api/admin/public-token`, {
    apiKey: config.FRIENDS_API_KEY,
    appId: Number(req.body.appId),
    name: req.body.name,
    scope: req.body.scope,
  });
  return res.sendStatus(HTTPStatus.OK);
};

const deletePublicApi = async (req: Request, res: Response) => {
  await callApi('delete', `${config.FRIENDS_URL}api/admin/public-token/${req.body.appId}`, {
    apiKey: config.FRIENDS_API_KEY,
  });
  return res.sendStatus(HTTPStatus.OK);
};

export const testfriendship = {
  getBlackList,
  getDelationList,
  getPublicApis,
  getTopQuizzesList,
  getUserDetail,
  banUser,
  unbanUser,
  startSeason,
  stopSeason,
  getSeason,
  putSeasonParticipants,
  createPublicApi,
  deletePublicApi
};
