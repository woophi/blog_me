import { createSelector } from 'reselect';
import { getAdminState } from './common';
import { FileItem } from 'core/models/admin';

export const getSelectedFile = createSelector(
  getAdminState,
  admin => admin.selectedFile || ({} as FileItem)
);
export const getFailedState = createSelector(
  getAdminState,
  admin => admin.uploadFailed
);
export const getAdminFiles = createSelector(
  getAdminState,
  admin => admin.files
);
