import { Model } from './mongoModel';

export type Ban = Model<BanModel>;

export type BanModel = {
  reason: string;
  ip?: string;
  email?: string;
  level: BanLevel
}

export enum BanLevel {
  COMMENT = 'comment',
  VIEW = 'view',
  ALL = 'all'
}
