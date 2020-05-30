import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { searchStatusEpic, searchResultsEpic } from './search';
import { quizParticipationEpic } from './user';

export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(searchStatusEpic, searchResultsEpic, quizParticipationEpic)(
    action$,
    store$,
    dependencies
  ).pipe(
    catchError((error, source) => {
      console.error(JSON.stringify(error));
      return source;
    })
  );
