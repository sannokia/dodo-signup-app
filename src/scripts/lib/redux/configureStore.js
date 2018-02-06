import { applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import createReduxWaitForMiddleware from 'redux-wait-for-action';

import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

import _compact from 'lodash/compact';

import configureReducers from './configureReducers';

Reactotron.configure({ name: 'Dodo Signup App' })
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect();

const router = routerMiddleware(browserHistory);
const logger = createLogger();
const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = _compact([
  router,
  process.env.NODE_ENV === 'development' ? logger : null,
  sagaMiddleware,
  createReduxWaitForMiddleware()
]);

export default function configureStore(reducerRegistry) {
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
