import React from 'react';
import optimizely, { variate } from 'react-optimizely';

import { Container, Row } from '@dodo/grid-components';

const Home = class extends React.Component {
  render() {
    var { optimizely } = this.props;

    console.log('HARO', optimizely);

    return (
      <Container>
        <Row size-2>
          {variate(
            {
              'With Image': () => (
                <img
                  className="placeholder placeholder--dodo"
                  src="/images/Dodo_Arms_Crossed_Standing.png"
                  alt="dodo"
                />
              ),
              'Without Image': () => <div>{'Without Image'}</div>,
              default: () => <div>{'No variant'}</div>
            },
            this.props.optimizely.variant
          )}
        </Row>
      </Container>
    );
  }
};

export default optimizely('Homepage')(Home);
