import { callApi } from 'core/common';
import * as models from 'core/models';
import { store } from 'core/store';

export const subscribe = (email: string) =>
  callApi<models.ResultSubscribe>('post', 'api/guest/subscribe', { email });

export const sendMessage = (data: models.MessageModel) =>
  callApi<void>('post', `api/guest/send/message`, data);

export const getCommentById = (commentId: string) =>
  callApi<models.CommentItem>(
    'get',
    `api/guest/blog/comment?commentId=${commentId}`
  );

export const guestUnsub = (uniqId: string) =>
  callApi<void>('put', 'api/guest/unsub', { uniqId });

export const resetPassword = (email: string) =>
  callApi<void>('post', 'api/guest/password/reset', { email });

export const updatePassword = (password: string, linkId: string) =>
  callApi<string>('patch', 'api/guest/password/update', { password, linkId });

export const getResetPassLinkState = (uniqId: string) =>
  callApi<models.LinkState>('get', `api/app/user/unsub/state?uniqId=${uniqId}`);

export const getBLogs = (offset = 0) =>
  callApi<models.BlogGuestItem[]>('get', `api/guest/blogs?offset=${offset}`);
export const getBLog = (blogId: number) =>
  callApi<models.BlogGuest>('get', `api/guest/blog?blogId=${blogId}`);

export const getBlogComments = (blogId: number, offset = 0) =>
  callApi<models.CommentItem[]>(
    'get',
    `api/guest/blog/comments?blogId=${blogId}&offset=${offset}`
  );
export const getCommentReplies = (parentId: string, offset = 0) =>
  callApi<models.CommentItem[]>(
    'get',
    `api/guest/blog/comment/replies?parentId=${parentId}&offset=${offset}`
  );

export const searchBlogs = async (query: string) => {
  try {
    const r = await callApi<models.BlogGuestItem[]>(
      'get',
      `api/guest/blogs/search?q=${query}`
    );

    store.dispatch({ type: 'SET_SEARCH_RESULTS', payload: r });
  } catch {
    store.dispatch({
      type: 'SET_SEARCH_STATUS',
      payload: models.SearchStatus.error
    });
  }
};

export const viewBlog = (blogId: number) => callApi('post', 'api/guest/blog/view', {
  blogId
});
