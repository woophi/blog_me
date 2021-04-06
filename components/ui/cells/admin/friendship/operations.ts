import { callUserApi } from 'core/common';
import * as admin from 'core/models/admin';

export const getBlackList = () =>
  callUserApi<admin.BlackListItem[]>('get', `api/admin-f/blacklist`);
export const getDelationList = () =>
  callUserApi<admin.DelationItem[]>('get', `api/admin-f/delations`);
export const getTopCoinsList = () =>
  callUserApi<admin.TopCoinItem[]>('get', `api/admin-f/top-coins`);
export const getTopQuizzesList = () =>
  callUserApi<admin.PopularQuizItem[]>('get', `api/admin-f/top-quizzies`);
export const getFriendUserDetail = (vkUserId: number) =>
  callUserApi<admin.UserDetail>(
    'get',
    `api/admin-f/user-detail?vkUserId=${vkUserId}`
  );
export const banUser = (payload: admin.BanPayload) =>
  callUserApi('post', `api/admin-f/user-ban`, payload);
export const unbanUser = (payload: admin.UnBanPayload) =>
  callUserApi('delete', `api/admin-f/user-unban`, payload);

export const setReasonLabel = (reason: admin.DelationReason) => {
  switch (reason) {
    case admin.DelationReason.Swearing:
      return 'Мат';
    case admin.DelationReason.Violence:
      return 'Насилие';
    case admin.DelationReason.Insult:
      return 'Оскорбления';
  }
};
export const setUnbanReasonLabel = (reason: admin.UnbanReason) => {
  switch (reason) {
    case admin.UnbanReason.Expired:
      return 'Истек срок';
    case admin.UnbanReason.Payment:
      return 'Выкуп';
    default:
      return '';
  }
};
export const setLeagueTypeLabel = (reason: admin.LeagueType) => {
  switch (reason) {
    case admin.LeagueType.Bronze:
      return 'Бронза';
    case admin.LeagueType.Diamond:
      return 'Алмаз';
    case admin.LeagueType.Gold:
      return 'Золото';
    case admin.LeagueType.Platinum:
      return 'Платина';
    case admin.LeagueType.Silver:
      return 'Серебро';
    case admin.LeagueType.TheBest:
      return 'Топчик';
    default:
      return '';
  }
};
