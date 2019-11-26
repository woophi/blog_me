import { getBlogComments, createComment } from 'core/operations';
import { store } from 'core/store';
import { NewComment } from 'core/models';

export const getComments = async (blogId: string) => {
  try {
    const comments = await getBlogComments(blogId);
    store.dispatch({ type: 'SET_COMMENTS', payload: { blogId,  comments } });
  } catch (error) {
    console.error(error);
  }
};

export const newComment = (data: NewComment, blogId: string) =>
  createComment(blogId, data);
