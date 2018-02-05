/* eslint import/extensions: 0 */
import bugsnag from 'bugsnag-js';
const bugsnagClient = bugsnag('8e63074058ee908c6a1ab7e03d6a8e45');

import React from 'react';
import createPlugin from 'bugsnag-react';

import { default as ReactDOM, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import ReducerRegistry from 'lib/redux/ReducerRegistry';
import configureStore from 'lib/redux/configureStore';
import coreReducers from 'redux-ducks/core';
import routes from './routes';

import MainLayout from './components/MainLayout';

const history = createHistory();
const reducerRegistry = new ReducerRegistry(coreReducers);
const store = configureStore(reducerRegistry, history);
const Routes = routes(store, reducerRegistry);
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
  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary>
        <ConnectedRouter history={history}>
          <MainLayout>
            <Switch>
              <Route exact path="/" component={Routes.HomePage} />
              <Route exact path="/scratch" component={Routes.ScratchPage} />
              <Redirect to="/" />
            </Switch>
          </MainLayout>
        </ConnectedRouter>
      </ErrorBoundary>
    </Provider>,
    document.getElementById('app')
  );
};

render();

if (module.hot) {
  module.hot.accept('routes', () => {
    setImmediate(() => {
      unmountComponentAtNode(document.getElementById('app'));
      render();
    });
  });
}
