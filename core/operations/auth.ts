import { store } from 'core/store';
import { isUserAuthorized } from 'core/selectors';
import Router from 'next/router';
import { callApi, getWindow } from 'core/common';
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
      userId: ''
    }
  });
  store.dispatch({ type: 'SET_USER_FETCHING', payload: false });
  const w = getWindow();
  w ? w.location.reload() : await Router.reload();
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

// FIXME: fix this logic
export const ensureNotAuthorized = async () => {
  await checkAuth();
  const state = store.getState();
  if (!isUserAuthorized(state)) {
    Router.push('/login');
  } else {
    connectAdminSocket();
  }
};
export const ensureAuthorized = async () => {
  await checkAuth();
  const state = store.getState();
  if (isUserAuthorized(state)) {
    connectAdminSocket();
    Router.push('/admin');
  }
};
