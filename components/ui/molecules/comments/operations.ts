import { getBlogComments } from 'core/operations';
import { store } from 'core/store';
import { NewComment } from 'core/models';
import { callUserApi } from 'core/common';

export const getComments = async (blogId: number, offset = 0) => {
  try {
    const comments = await getBlogComments(blogId, offset);
    store.dispatch({ type: 'SET_COMMENTS', payload: { comments } });
  } catch (error) {
    console.error(error);
  }
};

export const newComment = async (
  data: NewComment,
  blogId: number,
  parentCommentId?: string
) => {
  await callUserApi<void>('post', 'api/app/user/comment', {
    blogId,
    message: data.message,
    parentId: parentCommentId,
  });

  if (parentCommentId) {
    store.dispatch({ type: 'NEW_REPLY', payload: parentCommentId });
  }
};
