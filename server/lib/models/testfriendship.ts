export enum DelationReason {
  Swearing = 1,
  Violence = 2,
  Insult = 3,
}

export enum UnbanReason {
  Payment = 1,
  Expired = 2,
}

export enum ExpectedActionPayload {
  BanW = 'ban_w',
  BanM = 'ban_m',
  BanYears = 'ban_years',
}

export type BanPayload = {
  vkUserId: number;
  reason: DelationReason;
  until: ExpectedActionPayload;
};
export type UnBanPayload = {
  vkUserId: number;
  reason: UnbanReason;
};
