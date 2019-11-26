import { Model } from './mongoModel';

export type Links = Model<LinksModel>;

export type LinksModel = {
  uniqId: string;
  email: string;
  valid: Date;
}
