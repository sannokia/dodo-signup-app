import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

export default function configureReducers(asyncReducers) {
  var newReducers = combineReducers({
    ...asyncReducers,
    routing
  });

  return newReducers;
}
