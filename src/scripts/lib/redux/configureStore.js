import { applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

import _compact from 'lodash/compact';

import configureReducers from './configureReducers';

Reactotron.configure({ name: 'Dodo Signup App' })
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect();

const logger = createLogger();
const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(reducerRegistry, history) {
  const router = routerMiddleware(history);

  var middlewares = _compact([
    router,
    process.env.NODE_ENV === 'development' ? logger : null,
    sagaMiddleware
  ]);

  var rootReducer = configureReducers(reducerRegistry.getReducers());

  var store = Reactotron.createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(configureReducers(reducers));
  });

  return store;
}

export { sagaMiddleware };
