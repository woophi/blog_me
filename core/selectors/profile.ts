import { createSelector } from 'reselect';
import { selectState } from './common';
import { getUserId } from './user';

export const getUserProfile = createSelector(selectState, (state) => state.profile);
export const getUserComments = createSelector(
  getUserProfile,
  ({ comments }) => comments
);

export const shouldFetchUserRepliesAndComments = createSelector(
  getUserId,
  getUserComments,
  (userId, comments) => !!userId && !!Object.values(comments).length
);
