import { call, put, takeLatest } from 'redux-saga/effects';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import Zeus from 'lib/zeus-client';

const FETCH_REQUESTED = 'gists/FETCH_REQUESTED';
const FETCH_SUCCESS = 'gists/FETCH_SUCCESS';
const FETCH_FAILED = 'gists/FETCH_FAILED';

const initialState = {
  list: [],
  isFetching: false
};

function fetchGists() {
  return {
    type: FETCH_REQUESTED,
    [WAIT_FOR_ACTION]: FETCH_SUCCESS,
    [ERROR_ACTION]: FETCH_FAILED
  };
}

const getGists = () => {
  return new Promise((resolve, reject) => {
    Zeus.request({
      url: '/gists',
      success: resolve,
      error: reject
    });
  });
};

// Worker Saga: we create the task that will perform the asynchronous action
function* fetchData() {
  try {
    const response = yield call(getGists);
    yield put({ type: FETCH_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: FETCH_FAILED, message: e.message });
  }
}

// Root Saga: To launch the above task on each FETCH_REQUESTED action
const rootSaga = function*() {
  yield takeLatest(FETCH_REQUESTED, fetchData);
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_REQUESTED: {
      return { ...state, isFetching: true };
    }

    case FETCH_SUCCESS:
      var { payload } = action;

      var list = payload;

      return { ...state, list, isFetching: false };
  }

  return state;
};

const runSaga = (sagaMiddleware) => {
  sagaMiddleware.run(rootSaga);
};

const actionCreators = {
  fetchGists
};

const actionTypes = {
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  FETCH_FAILED
};

export { runSaga, actionCreators, actionTypes };

export default reducer;
