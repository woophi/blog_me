export type AdminQuizItem = {
  shortId: number;
  status: QuizzStatus;
  subtitle: string;
  title: string;
  quizQuestions: string[];
  quizParticipants: string[];
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
};

export type SaveQuestionModel = {
  id: string;
} & Pick<QuestionData, 'question' | 'step'>;
