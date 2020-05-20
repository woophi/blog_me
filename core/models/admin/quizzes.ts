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

export type AdminQuizData = {
  quizId: number;
  status: QuizzStatus;
  subtitle: string;
  title: string;
  questions: string;
};
