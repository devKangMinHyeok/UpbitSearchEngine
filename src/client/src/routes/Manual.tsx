import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  MainContainer,
  MainHeader,
  MainTitle,
} from "../component/mainComponent";
import EngineContainer from "../engines/EngineContainer";

function Manual() {
  return (
    <MainContainer>
      <MainHeader>
        <Link to={`/manual`}>수동</Link>
        <Link to={`/auto`}>자동</Link>
        <MainTitle>Upbit Search Engine</MainTitle>
      </MainHeader>
      <EngineContainer></EngineContainer>
    </MainContainer>
  );
}
export default Manual;
