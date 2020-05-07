export enum FStorageEvents {
  CLOUDINARY_ASK_STREAM = 'upload to cloudinary stream',
  CLOUDINARY_ASK_URL = 'upload to cloudinary url',
  DELETE_TEMP_FILE = 'delete temp file',
  UPLOADED_FILE_SUCCESS = 'uploaded files success',
  UPLOADED_FILE_ERROR = 'uploaded files error'
}

export type FileEventParams = {
  fileName: string;
  blogId: string;
  done: (err?: Error) => void;
};
export type FileUrlEventParams = {
  fileUrl: string;
  done: (err?: Error) => void;
};

export type FileCompleteParams = {
  fileName: string;
  fileId: string;
  url: string;
  format: string;
}