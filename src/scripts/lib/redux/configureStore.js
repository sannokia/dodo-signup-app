import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import _compact from 'lodash/compact';

import configureReducers from './configureReducers';

const logger = createLogger();
const saga = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(reducerRegistry, history) {
  const router = routerMiddleware(history);

  var middlewares = _compact([
    thunk,
    saga,
    router,
    process.env.NODE_ENV === 'development' ? logger : null
  ]);

  var rootReducer = configureReducers(reducerRegistry.getReducers());

  var store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(configureReducers(reducers));
  });

  return store;
}

export { saga };
