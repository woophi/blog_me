import { callApi, callUserApi } from 'core/common';
import { LocalStorageManager } from 'core/localStorageManager';
import { getUserId } from 'core/selectors';
import { store } from 'core/store';

export const likeBlog = async (blogId: number) => {
  const liked = await callApi<{ likeId: string }>(
    'post',
    `api/guest/blog/like?blogId=${blogId}`
  );

  if (liked?.likeId && !getUserId(store.getState())) {
    const likes = <string[]>LocalStorageManager.get(blogId, 'likes') || [];
    LocalStorageManager.set(blogId, 'likes', [...likes, liked.likeId]);
  }
};

export const dislikeBlog = async (blogId: number) => {
  if (getUserId(store.getState())) {
    callUserApi<boolean>('delete', `api/app/user/blog/dislike?blogId=${blogId}`);
  } else {
    LocalStorageManager.delete(blogId, 'likes');
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
    } else {
      const likes = <string[]>LocalStorageManager.get(blogId, 'likes');
      return !!likes?.length;
    }
  } catch {
    return false;
  }
};
