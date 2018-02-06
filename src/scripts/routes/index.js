import deferredComponent from 'react-imported-component';
import { sagaMiddleware } from 'lib/redux/configureStore';

import { actionCreators as gistActionsCreators } from 'redux-ducks/gist';

export default (store, reducerRegistry) => {
  return {
    HomePage: deferredComponent(() => {
      var duck = require('redux-ducks/gist');

      reducerRegistry.register({ gist: duck.default });
      duck.runSaga(sagaMiddleware);

      if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
          module.hot.accept('redux-ducks/gist', () => {
            reducerRegistry.register({ gist: duck });
          });
        }
      }

      store.dispatch(gistActionsCreators.fetchGists());

      return import(/* webpackChunkName:'home' */ '../modules/Home');
    }),
    ScratchPage: deferredComponent(() => {
      return import(/* webpackChunkName:'scratch' */ '../modules/Scratch');
    })
  };
};
