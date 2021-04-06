import { createSelector } from 'reselect';
import { getAdminState } from './common';

export const getSelectedVkUser = createSelector(
  getAdminState,
  (admin) => admin.selectedVkUser
);
