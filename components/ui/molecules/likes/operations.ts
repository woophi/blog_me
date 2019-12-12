import { callApi } from 'core/common';
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
    return true;
  }
  return false;
};

export const dislikeBlog = async (blogId: number) => {
  if (getGuestLikeState(blogId)) {
    LocalStorageManager.delete(blogId, 'likes');
    return true;
  } else {
    if (getUserId(store.getState())) {
      return await callApi<boolean>(
        'delete',
        `api/app/user/blog/dislike?blogId=${blogId}`
      );
    }
    return false;
  }
};

export const getGuestLikeState = (blogId: number) => {
  const likes = <string[]>LocalStorageManager.get(blogId, 'likes');
  return !!likes?.length;
};
