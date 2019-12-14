import { callUserApi } from 'core/common';

export const askIgLogin = async () => {

  const check = await callUserApi<boolean>('patch', 'api/admin/ig/check');

  if (check) return true;

  await callUserApi('patch', 'api/admin/ig/login');
  return false;
}
export const sendIgCode = async (code: number) => {
  return await callUserApi<boolean>('patch', 'api/admin/ig/code', { code });
}
