export enum FStorageEvents {
  CLOUDINARY_ASK = 'upload to cloudinary',
  DELETE_TEMP_FILE = 'delete temp file',
  UPLOADED_FILE_SUCCESS = 'uploaded files success',
  UPLOADED_FILE_ERROR = 'uploaded files error'
}

export type FileEventParams = {
  fileName: string;
  blogId: string;
  done: (err?: Error) => void;
};

export type FileCompleteParams = {
  fileName: string;
  fileId?: string;
  url?: string;
}

export type CloudinaryImg = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  // fqing overrides to "file" when stream
  original_filename: string;
};
