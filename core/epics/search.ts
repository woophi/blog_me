import { Epic, ofType } from 'redux-observable';
import { AppDispatch, AppState, SearchStatus } from 'core/models';
import { debounceTime, ignoreElements, mergeMap } from 'rxjs/operators';
import { searchBlogs } from 'core/operations';

const SAVING_DEBOUNCE = 750;

export const searchStatusEpic: Epic<AppDispatch, AppDispatch, AppState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType('SET_SEARCH_QUERY'),
    debounceTime(SAVING_DEBOUNCE),
    mergeMap(action => {
      const actions: AppDispatch[] = [];

      if (action.payload) {
        actions.push({
          type: 'SET_SEARCH_STATUS',
          payload: SearchStatus.update
        });
      } else {
        actions.push({
          type: 'SET_SEARCH_STATUS',
          payload: SearchStatus.init
        });
      }
      return actions;
    })
  );
export const searchResultsEpic: Epic<any, any, AppState> = (action$, state$) =>
  action$.pipe(
    ofType('SET_SEARCH_STATUS'),
    mergeMap(async action => {
      const q = state$.value.ui.searchQuery;
      if (action.payload === SearchStatus.update) {
        await searchBlogs(q);
      }
    }),
    ignoreElements()
  );
