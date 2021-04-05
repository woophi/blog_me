import { callUserApi } from 'core/common';
import * as admin from 'core/models/admin';

export const getBlackList = () =>
  callUserApi<admin.BlackListItem[]>('get', `api/admin-f/blacklist`);
