import { getBlogComments } from 'core/operations';
import { store } from 'core/store';
import { NewComment } from 'core/models';

export const getComments = async (blogId: number, offset = 0) => {
  try {
    const comments = await getBlogComments(blogId, offset);
    store.dispatch({ type: 'SET_COMMENTS', payload: { comments } });
  } catch (error) {
    console.error(error);
  }
};

export const newComment = async (data: NewComment, blogId: number) => {
  throw 'suck'
};
