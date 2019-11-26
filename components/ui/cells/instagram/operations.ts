import { callAdminApi } from 'core/common';

export const askIgLogin = async () => {

  const check = await callAdminApi<boolean>('patch', 'api/admin/ig/check');

  if (check) return true;

  await callAdminApi('patch', 'api/admin/ig/login');
  return false;
}
export const sendIgCode = async (code: number) => {
  return await callAdminApi<boolean>('patch', 'api/admin/ig/code', { code });
}
