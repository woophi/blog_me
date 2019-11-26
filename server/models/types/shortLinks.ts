import { Model } from './mongoModel';

export type ShortLinksModel = {
  originalUrl: string;
  urlCode: string;
  shortUrl: string;
};

export type ShortLink = Model<ShortLinksModel>;
