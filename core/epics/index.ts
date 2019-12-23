import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { searchStatusEpic, searchResultsEpic } from './search';

export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(searchStatusEpic, searchResultsEpic)(
    action$,
    store$,
    dependencies
  ).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );
