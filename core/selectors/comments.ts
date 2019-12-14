import { createSelector, defaultMemoize } from 'reselect';
import { selectState } from './common';
import sortBy from 'ramda/src/sortBy';
import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';

const getAllComments = createSelector(selectState, ui => ui.comments);
const getAllReplies = createSelector(selectState, ui => ui.replies);

export const getCommentsByBlogId = createSelector(getAllComments, comments =>
  defaultMemoize((blogId: number) =>
    sortBy(prop('createdAt'))(
      uniqBy(
        prop('_id'),
        comments.filter(c => c.blog?.blogId === blogId)
      )
    )
  )
);
export const getReplies = createSelector(getAllReplies, replies =>
  sortBy(prop('createdAt'))(uniqBy(prop('_id'), replies))
);
