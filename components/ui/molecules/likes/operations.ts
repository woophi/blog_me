import { callUserApi } from 'core/common';
import { getUserId } from 'core/selectors';
import { store } from 'core/store';

export const likeBlog = async (blogId: number) => {
  if (getUserId(store.getState())) {
    await callUserApi<{ likeId: string }>(
      'put',
      `api/app/user/like?blogId=${blogId}`
    );
  }
};

export const dislikeBlog = async (blogId: number) => {
  if (getUserId(store.getState())) {
    await callUserApi<boolean>(
      'delete',
      `api/app/user/blog/dislike?blogId=${blogId}`
    );
  }
};

export const getLikeState = async (blogId: number) => {
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
