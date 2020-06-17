import { store } from 'core/store';
import { isUserGod, getUserId, getUserToken } from 'core/selectors';
import Router from 'next/router';
import { callApi } from 'core/common';
import * as models from 'core/models';
import { connectAdminSocket } from 'core/socket/admin';

export const login = (email: string, password: string) =>
  callApi<{ token: string }>('post', 'api/app/user/login', { email, password });

export const logout = async () => {
  store.dispatch({ type: 'SET_USER_FETCHING', payload: true });
  await callApi<void>('post', 'api/app/user/logout');
  store.dispatch({
    type: 'SET_USER',
    payload: {
      name: '',
      roles: null,
      token: '',
      userId: '',
      email: '',
    },
  });
  store.dispatch({ type: 'SET_USER_FETCHING', payload: false });
};

export const checkAuth = async () => {
  store.dispatch({ type: 'SET_USER_FETCHING', payload: true });
  const data = await callApi<models.AuthData>('post', 'api/app/user/check');
  if (!data || !data.token) {
    store.dispatch({ type: 'SET_USER_FETCHING', payload: false });
    return;
  }
  store.dispatch({ type: 'SET_USER', payload: data });
  store.dispatch({ type: 'SET_USER_FETCHING', payload: false });
};

export const ensureNotAuthorized = async () => {
  await checkAuth();
  const state = store.getState();
  if (!getUserId(state)) {
    Router.push('/login');
    return;
  }
  if (isUserGod(state)) {
    connectAdminSocket(getUserToken(state));
  }
};
export const ensureAuthorized = async () => {
  await checkAuth();
  const state = store.getState();
  if (isUserGod(state)) {
    connectAdminSocket(getUserToken(state));
    Router.push('/admin');
  }
};
