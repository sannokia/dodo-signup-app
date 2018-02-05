import deferredComponent from 'react-imported-component';
import { sagaMiddleware } from 'lib/redux/configureStore';

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

      return import(/* webpackChunkName:'home' */ '../modules/Home');
    }),
    ScratchPage: deferredComponent(() => {
      return import(/* webpackChunkName:'scratch' */ '../modules/Scratch');
    })
  };
};
