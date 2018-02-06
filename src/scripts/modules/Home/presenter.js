import React from 'react';

import { Container, Row } from '@dodo/grid-components';
import Optimizely, { variate } from '../../components/Optimizely';

@Optimizely('Homepage')
export default class extends React.Component {
  componentWillMount() {
    var { dispatch, fetchGists } = this.props;

    dispatch(fetchGists());
  }

  render() {
    var { list = {} } = this.props;

    return (
      <Container>
        <Row size-2>
          <div>
            <img
              className="placeholder placeholder--dodo"
              src="/images/Dodo_Arms_Crossed_Standing.png"
              alt="dodo"
            />
            {JSON.stringify(list)}
          </div>
        </Row>
      </Container>
    );
  }
}
