/* eslint import/extensions: 0 */
import bugsnag from 'bugsnag-js';
const bugsnagClient = bugsnag('8e63074058ee908c6a1ab7e03d6a8e45');

import React from 'react';
import createPlugin from 'bugsnag-react';

import { default as ReactDOM, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import ReducerRegistry from 'lib/redux/ReducerRegistry';
import configureStore from 'lib/redux/configureStore';
import coreReducers from 'redux-ducks/core';
import { default as getRoutes } from './routes';

const reducerRegistry = new ReducerRegistry(coreReducers);
const store = configureStore(reducerRegistry);
const history = syncHistoryWithStore(browserHistory, store);
const ErrorBoundary = bugsnagClient.use(createPlugin(React));

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('redux-ducks/core', () => {
      var nextCoreReducers = require('redux-ducks/core').default;
      reducerRegistry.register(nextCoreReducers);
    });
  }
}

const render = () => {
  var appRoutes = getRoutes(store, reducerRegistry);

  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary>
        <Router history={history} routes={appRoutes} />
      </ErrorBoundary>
    </Provider>,
    document.getElementById('app')
  );
};

render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    setImmediate(() => {
      unmountComponentAtNode(document.getElementById('app'));
      render();
    });
  });
}
