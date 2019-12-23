import { callApi, callUserApi } from 'core/common';
import { getUserId } from 'core/selectors';
import { store } from 'core/store';

export const likeBlog = async (blogId: number) => {
  await callApi<{ likeId: string }>('post', `api/guest/blog/like?blogId=${blogId}`);
};

export const dislikeBlog = async (blogId: number) => {
  if (getUserId(store.getState())) {
    callUserApi<boolean>('delete', `api/app/user/blog/dislike?blogId=${blogId}`);
  }
};

export const getGuestLikeState = async (blogId: number) => {
  try {
    if (getUserId(store.getState())) {
      const hasLike = await callUserApi<boolean>(
        'get',
        `api/app/user/like?blogId=${blogId}`
      );
      return hasLike;
    }
    return false;
  } catch {
    return false;
  }
};
