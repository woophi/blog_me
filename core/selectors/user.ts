import { createSelector, defaultMemoize } from 'reselect';
import { selectState } from './common';
import { IROLES, AuthData, AppState } from 'core/models';
import { getCommentsByBlogId } from './comments';

export const getUser = createSelector(
  selectState,
  ui => ui.user || ({} as AuthData)
);
export const getUserToken = createSelector(getUser, user => user.token);
export const getUserRoles = createSelector(getUser, user => user.roles || []);
export const getUserId = createSelector(getUser, user => user.userId);
export const getUserName = createSelector(getUser, user => user.name);
export const hasRoleAdmin = createSelector(
  getUserRoles,
  roles => roles.indexOf(IROLES.ADMIN) !== -1
);
export const hasRoleSuperAdmin = createSelector(
  getUserRoles,
  roles => roles.indexOf(IROLES.GODLIKE) !== -1
);
export const hasRoleComment = createSelector(
  getUserRoles,
  roles => roles.indexOf(IROLES.COMMENT) !== -1
);
export const isUserGod = createSelector(
  hasRoleAdmin,
  hasRoleSuperAdmin,
  (admin, superAdmin) => admin || superAdmin
);
export const canUserComment = createSelector(
  isUserGod,
  hasRoleComment,
  (god, comment) => god || comment
);
export const getUserFetching = createSelector(getUser, user => user.fetching);

export const hasUserCommentMenu = createSelector(
  [canUserComment, getUserId, getCommentsByBlogId],
  (hasAccess, userId, comments) =>
    defaultMemoize(
      (commentId: string, blogId: number) =>
        hasAccess &&
        !!comments(blogId).find(c => c._id === commentId && c.user?._id == userId)
    )
);
