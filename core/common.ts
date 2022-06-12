import axios, { AxiosRequestConfig } from 'axios';
import getConfig from 'next/config';
import Router from 'next/router';
import { getUserToken } from './selectors';
import { store } from './store';

const { publicRuntimeConfig } = getConfig();
const { SITE_URL } = publicRuntimeConfig;

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

const api = <T>(
  method: HTTPMethod = 'post',
  url: string,
  data: any = null,
  siteUrl: string,
  auth?: string
): Promise<T> => {
  const rc: AxiosRequestConfig = {
    url: '/' + url,
    headers: {
      Accept: 'application/json',
    },
    method,
  };

  if (typeof data === 'string') {
    rc.data = data;
    rc.headers['Content-Type'] = 'application/octet-stream';
  } else if (data === null) {
    data = null;
  } else {
    rc.data = JSON.stringify(data);
    rc.headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  if (auth) {
    rc.headers.Authorization = `${auth}`;
  }

  return axios(rc).then(
    (r) => (r.status === 204 ? null : (r.data as T)),
    (f) => {
      const errorData = (f && 'response' in f && f.response
        ? (f.response['data'] as any)
        : null) || { code: null, message: null };
      return Promise.reject(errorData) as any;
    }
  );
};

export const callApi = <T>(
  method: HTTPMethod = 'post',
  url: string,
  data: any = null,
  auth?: string
): Promise<T> => {
  return api(method, url, data, SITE_URL, auth);
};

export const callUserApi = <T>(
  method: HTTPMethod = 'post',
  url: string,
  data: any = null
): Promise<T> => callApi<T>(method, url, data, getUserToken(store.getState()));

export const uploadFiles = (files: File[]) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach((f) => formData.append(f.name, f));

    const url = `/storage/upload`;

    const request = new XMLHttpRequest();
    request.onload = () => {
      if (request.status < 400) {
        resolve();
      } else {
        reject();
      }
    };
    request.onerror = () => {
      reject();
    };
    request.open('POST', url);
    request.send(formData);
  });
};

export const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

export const getWindow = () => {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
};

export const goToDeep = (href: string) => Router.push(`${Router.route}/${href}`);
export const goToSpecific = (href: string) => Router.push(href);
