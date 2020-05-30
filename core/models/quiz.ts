import { QuizzStatus, QuizQuestionType } from './admin';

export { QuizzStatus, QuizQuestionType } from './admin';

export type QuizGuestData = {
  quizId: number;
  status: QuizzStatus;
  subtitle: string;
  title: string;
  questions: QuizQuestionGuestData[];
  participationHistory: ParticipationHistory | null;
};

export type QuizQuestionGuestData = {
  id: string;
  step: number;
  question: string;
  type: QuizQuestionType;
};

export type ParticipationHistory = {
  finished: boolean;
  lastStep: number;
  answers: ParticipationAnswers;
};

export type ParticipationAnswers = {
  [step: number]: string;
};
