export type GeneralVkUser = {
  userId?: number;
  avatar?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
};

export type BlackListItem = GeneralVkUser & {
  id: number;
  vkUserId: number;
  bannedById: number;
  reason: DelationReason;
  until: Date | null;
  times: number;
  unbanReason: UnbanReason | null;
};
export enum DelationReason {
  Swearing = 1,
  Violence = 2,
  Insult = 3,
}

export enum UnbanReason {
  Payment = 1,
  Expired = 2,
}

export enum CoinPack {
  Small_5 = 'small_5',
  Middle_10 = 'middle_10',
  Big_15 = 'big_15',
  Bigger_30 = 'bigger_30',
  Biggest_60 = 'biggest_60',
}

export type DelationItem = GeneralVkUser & {
  amountDelations: string;
  userIdToBan: number;
};

export type PublicApiItem = {
  id: number;
  appId: number;
  name: string;
  scope: string;
  token: string;
  created: Date;
  lastUsed: Date;
  deleted: Date | null;
};

export type PopularQuizItem = GeneralVkUser & {
  amountOfFriends: string;
  id: string;
  vkUserId: number;
};

export type UserDetail = {
  userInfo: GeneralVkUser;
  userDelations: {
    amountOfReasons: string;
    reason: DelationReason;
  }[];
  banInfo?: {
    id: number;
    vkUserId: number;
    bannedById: number;
    reason: DelationReason;
    until: Date | null;
    times: number;
    unbanReason: UnbanReason | null;
  };
  sub?: {
    id: string;
    vkUserId: number;
    amount: number;
    amountWithoutFee: number;
    created: Date;
    until: Date;
    subscriptionType: string;
  };
  donations: {
    id: string;
    vkUserId: number;
    amount: number;
    created: Date;
    paymentTarget: CoinPack;
  }[];
  quizInfo: ResponseQuizF | null;
  friends: VkFriendItem[];
  rank: {
    id: string;
    vkUserId: number;
    points: number;
    joined: Date;
    barrack: {
      id: number;
      name: string;
      participantsCount: number;
    };
    leagueGroup: {
      id: number;
      groupOrder: LeagueGroupOrder;
      globalLeague: {
        id: number;
        leagueType: LeagueType;
      };
    };
  } | null;
  coins: number;
};

export enum LeagueType {
  TheBest = 1,
  Diamond = 2,
  Platinum = 3,
  Gold = 4,
  Silver = 5,
  Bronze = 6,
}

export enum LeagueGroupOrder {
  First = 1,
  Second = 2,
  Third = 3,
}

export enum QuizFriendType {
  Anon = 1,
  Public = 2,
}
export type VkFriendItem = {
  friendId: string;
  firstName: string;
  lastName: string;
  friendType?: QuizFriendType;
  avatar?: string;
  questionsNumber: string;
  rightsNumber: string;
  vkUserId: number | null;
};

export type AnswerF = {
  emoji: string;
  text: string;
  id: string;
};

export type QuestionF = {
  step: number;
  question: string;
  backgroundCard: string;
  answers: AnswerF[];
};

export type ResponseQuizF = {
  questions: { [step: number]: QuestionF };
  friendUserName: string;
};

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
export type SubscriptionPayload = {
  vkUserId: number;
};

export type SeasonInfo = {
  run: boolean;
  seasonId: number;
  seasonOrder: number;
  participantsCount: number;
  allQuizCount: number;
};

export enum PublicApiScope {
  PaidSub = 'paid_sub',
}

export type PublicApiPayload = {
  appId: number;
  name: string;
  scope: PublicApiScope;
};
