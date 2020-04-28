import thunk from 'redux-thunk';
import {
  applyMiddleware,
  combineReducers,
  createStore,
  ReducersMapObject,
  Store
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initialState, reducer as uiReducer } from 'core/reducers';
import { AppState, AppDispatch } from 'core/models';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics';

const epicMiddleware = createEpicMiddleware();

const middleware = applyMiddleware(thunk, epicMiddleware);

const rootReducerMap: ReducersMapObject<AppState, AppDispatch> = {
  ui: uiReducer
};

export const store: Store<AppState, AppDispatch> = createStore(
  combineReducers(rootReducerMap),
  { ui: initialState },
  composeWithDevTools(middleware)
) as any;

epicMiddleware.run(rootEpic);

export const initStore = (initState = { ui: initialState }): any => {
  return store;
};
