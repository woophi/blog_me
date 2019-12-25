import { callUserApi } from 'core/common';
import { store } from 'core/store';
import { FacebookPageItem } from 'core/models/admin';

export const getFacebookPageIds = () =>
  callUserApi<{ id: number; valid: boolean }[]>('get', 'api/admin/fb/pages');
export const getFacebookPages = () =>
  callUserApi<FacebookPageItem[]>('get', 'api/admin/fb/pages/full');

export const checkTokenValidation = async (pageId: number) => {
  const { valid } = await callUserApi<{ valid: boolean }>(
    'patch',
    'api/admin/fb/check/token',
    {
      pageId
    }
  );
  store.dispatch({ type: 'UPDATE_FACEBOOK_ACTIVE', payload: valid });
  return valid;
};
