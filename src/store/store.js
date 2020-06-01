/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {} from './middleware';

import Api from 'api';
import * as branches from './branches';

const persistConfig = {
  key: 'auth',
  storage,
};

const apiReducers = Api.getReducers();

const rootReducer = combineReducers({
  ...branches,
  api: apiReducers.api,
  // auth: persistReducer(persistConfig, apiReducers.auth),
  auth: apiReducers.auth,
});

const middleware = [thunk];
const devStoreEnhancer = [];

if (__DEV__) {
  // If the user has the "Redux DevTools" browser extension installed, use that.
  // Otherwise, hook up the in-page DevTools UI component.
  const debugEnhancer =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f;
  devStoreEnhancer.push(debugEnhancer);
  if (__CONF__.reduxLogger) middleware.push(logger);
}

const storeEnhancers = [applyMiddleware(...middleware), ...devStoreEnhancer];

let globalStore = null;

export default (initialState = {}) => {
  if (globalStore) {
    return globalStore;
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(...storeEnhancers)
  );

  if (module.hot && __DEV__) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(rootReducer, () => {
      try {
        const nextReducer = rootReducer;
        store.replaceReducer(nextReducer);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`==> Reducer hot reloading error ${error}`);
      }
    });
  }

  globalStore = store;
  return store;
};
