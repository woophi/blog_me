import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';

export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(null)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );
