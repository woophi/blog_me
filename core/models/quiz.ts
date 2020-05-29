import { QuizzStatus } from './admin';

export type QuizGuestData = {
  quizId: number;
  status: QuizzStatus;
  subtitle: string;
  title: string;
  questions: QuizQuestionGuestData[];
};

export type QuizQuestionGuestData = {
  id: string;
  step: number;
  question: string;
};
