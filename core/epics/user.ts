import { Epic, ofType } from 'redux-observable';
import { AppDispatch, AppState, AuthData } from 'core/models';
import { mergeMap, filter } from 'rxjs/operators';
import { getQuizParticipantionInfo } from 'core/operations/quizParticipants';
import { getQuizId } from 'core/selectors';

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