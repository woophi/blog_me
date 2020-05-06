import { uploadFiles, callUserApi } from 'core/common';
import { store } from 'core/store';
import { FileItem } from 'core/models/admin';


export const selectFile = (payload: FileItem) => {
  store.dispatch({ type: 'SELECT_FILE', payload });
};
export const deselectFile = () => {
  store.dispatch({ type: 'SELECT_FILE', payload: null });
};

export const failedFalse = () => {
  store.dispatch({ type: 'UPLOAD_FAILED', payload: false });
};

export const uploadFile = async (files: File[]) => {
  store.dispatch({ type: 'SELECT_FILE', payload: null });
  store.dispatch({ type: 'UPLOADING_FILE', payload: true });
  try {
    await uploadFiles(files);
  } catch (error) {
    store.dispatch({ type: 'UPLOADING_FILE', payload: false });
  }
};

export const uploadFileUrl = async (url: string) => {
  store.dispatch({ type: 'SELECT_FILE', payload: null });
  store.dispatch({ type: 'UPLOADING_FILE', payload: true });
  try {
    await callUserApi('post', 'api/admin/file', { url });
  } catch (error) {
    store.dispatch({ type: 'UPLOADING_FILE', payload: false });
  }
};

export const getChosenFile = (fileId: string) => {
  if (!fileId) return {} as FileItem;
  return (
    store.getState().ui.admin.files.find(f => f._id == fileId) || ({} as FileItem)
  );
};

export const fetchFiles = async () => {
  try {
    const data = await callUserApi<FileItem[]>('get', 'api/admin/files');
    store.dispatch({ type: 'FETCH_FILES', payload: data });
  } catch (error) {
    return error.error;
  }
};
