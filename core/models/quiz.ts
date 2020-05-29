import { QuizzStatus } from './admin';

export { QuizzStatus } from './admin';

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
};

export type ParticipationHistory = {
  finished: boolean;
  lastStep: number;
  answers: {
    [step: number]: string;
  }
}