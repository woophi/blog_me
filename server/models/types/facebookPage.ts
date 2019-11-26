import { Model } from './mongoModel';

export type FacebookModel = {
  pageId: number;
  pageName: string;
  longLiveToken: string;
  accessToken: string;
  isValid: boolean;
};

export type FacebookPage = Model<FacebookModel>;
