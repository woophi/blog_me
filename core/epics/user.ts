import { Epic, ofType } from 'redux-observable';
import { AppDispatch, AppState, AuthData, ParticipationHistory } from 'core/models';
import { mergeMap, filter, debounceTime, ignoreElements } from 'rxjs/operators';
import {
  getQuizParticipantionInfo,
  patchQuizAnswers,
} from 'core/operations/quizParticipants';
import { getQuizId } from 'core/selectors';

const SAVING_DEBOUNCE = 250;

export const quizParticipationEpic: Epic<AppDispatch, AppDispatch, AppState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType('SET_USER'),
    filter(({ payload }) => !!(payload as AuthData).userId),
    mergeMap(async (action) => {
      const quizId = getQuizId(state$.value);
      const payload = await getQuizParticipantionInfo(quizId);
      return {
        type: 'UPDATE_QUIZ_PARTICIPANT',
        payload,
      } as AppDispatch;
    })
  );

export const quizParticipationAnswersEpic: Epic<
  AppDispatch,
  AppDispatch,
  AppState
> = (action$, state$) =>
  action$.pipe(
    ofType('UPDATE_QUIZ_PARTICIPANT'),
    debounceTime(SAVING_DEBOUNCE),
    filter(({ payload }) => !!(payload as ParticipationHistory).answers),
    mergeMap(async (action) => {
      const quizId = getQuizId(state$.value);
      await patchQuizAnswers(
        quizId,
        (action.payload as ParticipationHistory).answers
      );
    }),
    ignoreElements()
  );
