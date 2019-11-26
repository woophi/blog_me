import { Model } from './mongoModel';

export type Files = Model<FilesModel>

export type FilesModel = {
  name: string;
  url: string;
  thumbnail?: string;
}
