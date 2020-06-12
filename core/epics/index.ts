import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { searchStatusEpic, searchResultsEpic } from './search';
import { quizParticipationEpic, quizParticipationAnswersEpic, loadUserCommentsEpic } from './user';

export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(
    searchStatusEpic,
    searchResultsEpic,
    quizParticipationEpic,
    quizParticipationAnswersEpic,
    loadUserCommentsEpic
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );
