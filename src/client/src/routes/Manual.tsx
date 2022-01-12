import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EngineContainer from "../engines/EngineContainer";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.header`
  height: 2vh;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 20px;
  color: black;
  font-weight: 500;
`;

function Manual() {
  return (
    <Container>
      <Header>
        <Title>Upbit Search Engine</Title>
      </Header>
      <EngineContainer></EngineContainer>
    </Container>
  );
}
export default Manual;
