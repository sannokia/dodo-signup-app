import React from 'react';
import { Container, Column, Row } from '@dodo/grid-components';

const Home = class extends React.Component {
  render() {
    return (
      <Container>
        <Row size-2>
          <Column>
            <div>{'Hello World'}</div>
          </Column>
          <Column>
            <div>{'Hello World 2'}</div>
          </Column>
        </Row>
        <Row size-3>
          <Column omega>
            <div>{'Hello World'}</div>
          </Column>
          <Column>
            <div>{'Hello World 2'}</div>
          </Column>
        </Row>
        <Row collapse omega>
          <div>{'Hello World'}</div>
        </Row>
        <Row align>
          <div>{'Hello World'}</div>
        </Row>
      </Container>
    );
  }
};

export default Home;
