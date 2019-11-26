import thunk from 'redux-thunk';
import {
  applyMiddleware,
  combineReducers,
  createStore,
  Reducer,
  ReducersMapObject,
  Store
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initialState, reducer as uiReducer } from 'core/reducers';
import { AppState, AppDispatch } from 'core/models';

const middleware = applyMiddleware(thunk);

const rootReducerMap: ReducersMapObject<AppState, AppDispatch> = {
  ui: uiReducer
};

let asyncReducers: any = {};

function updateRootReducer() {
  store.replaceReducer(
    combineReducers({
      ...rootReducerMap,
      ...asyncReducers
    })
  );
}

export function injectReducer<T>(name: string, reducer: Reducer<T>) {
  asyncReducers[name] = reducer;
  updateRootReducer();
  return store;
}

export function injectReducers(reducers: ReducersMapObject) {
  asyncReducers = {
    ...asyncReducers,
    ...reducers
  };
  updateRootReducer();
  return store;
}

export const store: Store<AppState, AppDispatch> = createStore(
  combineReducers(rootReducerMap),
  { ui: initialState },
  composeWithDevTools(middleware)
) as any;

export const initStore = (
  initState = { ui: initialState }
): any => {
  return store;
};
