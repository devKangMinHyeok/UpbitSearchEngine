import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EngineContainer from "../engines/EngineContainer";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  color: black;
`;

function Home() {
  return (
    <Container>
      <Header>
        <Title>Upbit Search Engine</Title>
      </Header>
      <EngineContainer></EngineContainer>
      {/* <Envelope movingAverage={20} percent={10} /> */}
    </Container>
  );
}
export default Home;
