export type AdminQuizItem = {
  shortId: number;
  status: QuizzStatus;
  subtitle: string;
  quizQuestions: string[];
  quizParticipants: string[];
  plainTitle: string;
};

export enum QuizzStatus {
  Draft = 'draft',
  Open = 'open',
  Closed = 'closed',
}

type AdminQuizCommonData = {
  quizId: number;
  status: QuizzStatus;
  subtitle: string;
  title: string;
  id: string;
  plainTitle: string;
};

export type AdminQuizData = AdminQuizCommonData & {
  questions: string[];
};

export type AdminQuizFormData = AdminQuizCommonData & {
  questions: SaveQuestionModel[];
};

export type AdminQuizResponseData = AdminQuizCommonData & {
  questions: SaveQuestionModel[];
};

export type QuestionData = {
  quiz?: {
    shortId: number;
  };
  _id: string;
  step: number;
  question: string;
  type: QuizQuestionType;
};

export type SaveQuestionModel = {
  id: string;
} & Omit<QuestionData, '_id' | 'quiz'>;

export enum QuizQuestionType {
  SIMPLE = 'simple',
  NOTE = 'note',
}

export type AdminQuizParticipantData = {
  finished: boolean;
  lastStep: number;
  answers: AdminQuizParticipationAnswers;
  userName: string;
  userId: string;
  questions: {
    step: number;
    question: string;
  }[];
};

export type AdminQuizParticipationAnswers = {
  [step: number]: string;
};
