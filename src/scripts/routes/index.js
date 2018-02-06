import { sagaMiddleware } from 'lib/redux/configureStore';
import MainLayout from 'components/MainLayout';

import { actionCreators as gistActionsCreators } from 'redux-ducks/gist';

export default (store, reducerRegistry) => {
  return [
    {
      component: MainLayout,
      childRoutes: [
        {
          path: '/',
          getComponent: (location, cb) => {
            require.ensure(
              [],
              (require) => {
                var duck = require('redux-ducks/gist');
                var layout = require('modules/Home');

                reducerRegistry.register({ gist: duck.default });
                duck.runSaga(sagaMiddleware);

                if (process.env.NODE_ENV !== 'production') {
                  if (module.hot) {
                    module.hot.accept('redux-ducks/gist', () => {
                      reducerRegistry.register({ gist: duck });
                    });
                  }
                }

                Promise.all([
                  store.dispatch(gistActionsCreators.fetchGists())
                ]).then(() => {
                  cb(null, layout.default);
                });
              },
              'home'
            );
          }
        }
      ]
    }
  ];
};
