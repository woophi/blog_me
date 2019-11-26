import { Model } from './mongoModel';
import { Language } from './language';

export type GDPRModel = {
  text: string;
  language: Language
};
export type GDPRSaveModel = {
  text: string;
  language: string;
};

export type GDPR = Model<GDPRModel>;
