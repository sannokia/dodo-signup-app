import React from 'react';

import { Container, Row } from '@dodo/grid-components';
import Optimizely, { variate } from '../../components/Optimizely';

@Optimizely('Homepage')
export default class extends React.Component {
  render() {
    var { list = {}, optimizely } = this.props;

    return (
      <Container>
        <Row size-2>
          <div>
            {variate(
              {
                'With Image': () => (
                  <div>
                    <img
                      className="placeholder placeholder--dodo"
                      src="/images/Dodo_Arms_Crossed_Standing.png"
                      alt="dodo"
                    />
                    {JSON.stringify(list)}
                  </div>
                ),
                'Without Image': () => (
                  <div>{`Variant B for ${optimizely.experiment.name}`}</div>
                ),
                default: () => <div>{'No variant'}</div>
              },
              optimizely.variant
            )}
          </div>
        </Row>
      </Container>
    );
  }
}
