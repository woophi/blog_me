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
