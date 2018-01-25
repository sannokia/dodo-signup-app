const RESET = 'layout/RESET';
const SHOW_LOADER = 'layout/SHOW_LOADER';
const HIDE_LOADER = 'layout/HIDE_LOADER';

const initialState = {
  isLoading: false
};

function doReset() {
  return {
    type: RESET
  };
}

function doShowLoader() {
  return {
    type: SHOW_LOADER,
    isLoading: true
  };
}

function doHideLoader() {
  return {
    type: HIDE_LOADER,
    isLoading: false
  };
}

function applyLoaderToggle(state, action) {
  const { isLoading } = action;
  return { ...state, isLoading };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return applyLoaderToggle(state, action);
    case HIDE_LOADER:
      return applyLoaderToggle(state, action);
    case RESET:
      return initialState;
    default:
      return state;
  }
}

const actionCreators = {
  doReset,
  doShowLoader,
  doHideLoader
};

const actionTypes = {
  RESET,
  SHOW_LOADER,
  HIDE_LOADER
};

export { actionCreators, actionTypes };

export default reducer;
