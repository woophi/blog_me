import { createSelector, defaultMemoize } from 'reselect';
import { selectState } from './common';

const getAllComments = createSelector(selectState, ui => ui.comments);

export const getCommentsByBlogId = createSelector(getAllComments, comments =>
  defaultMemoize((blogId: number) => comments.filter(c => c.blog?.blogId === blogId))
);
