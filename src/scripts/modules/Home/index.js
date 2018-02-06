import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators } from 'redux-ducks/gist';

import HomeLayout from './presenter';

const mapStateToProps = (state) => {
  const { list } = state.gist;

  return {
    list
  };
};

const mapDispatchToProps = (dispatch) => {
  const boundActionCreators = bindActionCreators(actionCreators, dispatch);
  const allActionProps = { ...boundActionCreators, dispatch };

  return allActionProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeLayout);
