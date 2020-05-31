import { Model } from './mongoModel';
import { User } from './user';

export type Quiz = Model<QuizModel>;

export type QuizModel = {
  shortId: number;
  title: string;
  subtitle: string;
  status: QuizzStatus;
  deleted?: Date;

  quizQuestions: QuizQuestion[];
  quizParticipants: QuizParticipant[];
};

export enum QuizzStatus {
  Draft = 'draft',
  Open = 'open',
  Closed = 'closed',
}

export type QuizQuestion = Model<QuizQuestionModel>;

export type QuizQuestionModel = {
  question: string;
  step: number;
  type: QuizQuestionType;
  quiz?: Quiz;
};

export enum QuizQuestionType {
  SIMPLE = 'simple',
  NOTE = 'note',
}

export type QuizParticipant = Model<QuizParticipantModel>;

export type QuizParticipantModel = {
  user: User;
  quiz: Quiz;
} & ParticipationHistory;

export type ParticipationHistory = {
  finished: boolean;
  lastStep: number;
  answers: ParticipationAnswers;
};

export type ParticipationAnswers = {
  [step: number]: string;
};
