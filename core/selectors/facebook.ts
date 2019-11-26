import { createSelector } from 'reselect';
import { getAdminState } from './common';

export const getFacebookActiveStatus = createSelector(
  getAdminState,
  admin => admin.facebookActive
);
