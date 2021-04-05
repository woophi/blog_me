export type BlackListItem = {
  userId?: number;
  avatar?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
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

export type DelationItem = {
  userId?: number;
  avatar?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  amountDelations: string;
  userIdToBan: number;
};

export type TopCoinItem = {
  userId?: number;
  avatar?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  vkUserId: number;
  coins: number;
};

export type PopularQuizItem = {
  userId?: number;
  avatar?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  amountOfFriends: string;
  id: string;
  vkUserId: number;
};

export type UserDetail = {
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
      globalLeague: {
        id: number;
        leagueType: LeagueType;
      };
    };
    leagueGroup: {
      id: number;
      groupOrder: LeagueGroupOrder;
    };
  } | null;
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
