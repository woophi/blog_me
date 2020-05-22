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
}

export enum QuizzStatus {
  Draft = 'draft',
  Open = 'open',
  Closed = 'closed'
}

export type QuizQuestion = Model<QuizQuestionModel>;

export type QuizQuestionModel = {
  question: string;
  step: number;
  quiz?: Quiz;
}

export type QuizParticipant = Model<QuizParticipantModel>;

export type QuizParticipantModel = {
  lastStep: number;
  finished: boolean;
  user: User;
  quiz: Quiz;
  answers: {
    [step: number]: string;
  },
}