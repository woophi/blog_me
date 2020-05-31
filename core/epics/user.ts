import { Epic, ofType } from 'redux-observable';
import { AppDispatch, AppState, AuthData, ParticipationHistory } from 'core/models';
import {
  mergeMap,
  filter,
  ignoreElements,
  throttleTime,
} from 'rxjs/operators';
import {
  getQuizParticipantionInfo,
  patchQuizParticipation,
} from 'core/operations/quizParticipants';
import { getQuizId } from 'core/selectors';
import anyPass from 'ramda/src/anyPass';
import propEq from 'ramda/src/propEq';

const SAVING_DEBOUNCE = 1000;

export const quizParticipationEpic: Epic<AppDispatch, AppDispatch, AppState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType('SET_USER'),
    filter(({ payload }) => !!(payload as AuthData).userId),
    mergeMap(async () => {
      const quizId = getQuizId(state$.value);
      if (quizId) {
        const payload = await getQuizParticipantionInfo(quizId);
        return {
          type: 'UPDATE_QUIZ_PARTICIPANT',
          payload,
        } as AppDispatch;
      }
      return {
        type: 'UPDATE_QUIZ_PARTICIPANT',
        payload: null,
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
    throttleTime(SAVING_DEBOUNCE),
    filter(({ payload }) => {
      const action = payload as ParticipationHistory;

      return anyPass<ParticipationHistory>([
        propEq('answers', undefined),
        propEq('finished', undefined),
        propEq('lastStep', undefined),
      ])(action);
    }),
    mergeMap(async (action) => {
      const quizId = getQuizId(state$.value);
      await patchQuizParticipation(quizId, action.payload as ParticipationHistory);
    }),
    ignoreElements()
  );
