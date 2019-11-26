import { callApi } from 'core/common';

export const likeBlog = (blogId: string) =>
  callApi<boolean>('post', `api/guest/blog/like?id=${blogId}`);

export const dislikeBlog = (blogId: string) =>
  callApi<boolean>('delete', `api/guest/blog/dislike?id=${blogId}`);

export const getLikeState = (blogId: string) =>
  callApi<boolean>('get', `api/guest/blog/like?id=${blogId}`);
