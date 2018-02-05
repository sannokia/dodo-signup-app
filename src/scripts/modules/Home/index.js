import React from 'react';
import { Container, Row } from '@dodo/grid-components';

const Home = class extends React.Component {
  render() {
    return (
      <Container>
        <Row size-2>
          <img
            className="placeholder placeholder--dodo"
            src="/images/Dodo_Arms_Crossed_Standing.png"
            alt="dodo"
          />
        </Row>
      </Container>
    );
  }
};

export default Home;
