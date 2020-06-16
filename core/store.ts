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
import { MakeStore, Context, createWrapper } from 'next-redux-wrapper';

const epicMiddleware = createEpicMiddleware();

const middleware = applyMiddleware(epicMiddleware);

const rootReducerMap: ReducersMapObject<AppState, AppDispatch> = {
  ui: uiReducer
};

export const store: Store<AppState, AppDispatch> = createStore<AppState, AppDispatch, unknown, unknown>(
  combineReducers(rootReducerMap),
  { ui: initialState },
  composeWithDevTools(middleware)
);

epicMiddleware.run(rootEpic);

const makeStore: MakeStore<AppState, AppDispatch> = (context: Context) => store;

export const wrapper = createWrapper(makeStore);
