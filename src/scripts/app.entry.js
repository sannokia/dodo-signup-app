import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import ReducerRegistry from 'lib/redux/ReducerRegistry';
import configureStore from 'lib/redux/configureStore';
import coreReducers from 'redux-ducks/core';
import * as Routes from './routes';

const history = createHistory();
const reducerRegistry = new ReducerRegistry(coreReducers);
const store = configureStore(reducerRegistry, history);

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
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={Routes.HomePage} />
        </div>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  );
};

render();
