import { createSelector } from 'reselect';
import { selectState } from './common';
import { QuizGuestData } from 'core/models';

export const getQuizDataState = createSelector(
  selectState,
  (state) => state.quiz ?? ({} as QuizGuestData)
);
export const getQuizId = createSelector(
  getQuizDataState,
  quiz => quiz.quizId
);
