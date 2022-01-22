import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { autoAlgoListState, autoMarketCodesDataSetState } from "../../../atoms";
import AlgorithmStatus from "./AlgorithmStatus";
import SearchController from "./SearchController";

const Container = styled.div`
  width: 100%;
  height: 83vh;
  margin-top: 10px;
  padding-right: 20px;
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 100%;
`;

const ControllerContainer = styled.div`
  height: 100%;
  border: black 1px solid;
  display: grid;
  grid-template-rows: 2fr 1fr 4fr 3fr;
`;

const InfoContainer = styled.div`
  border: black 1px solid;
`;

function SearchInfo() {
  return <InfoContainer>InfoContainer</InfoContainer>;
}

const LogControllerContainer = styled.div`
  border: black 1px solid;
`;

const StatusContainer = styled.div`
  border: black 1px solid;
`;

function DashBoard() {
  const localSettingData = useRecoilValue(autoMarketCodesDataSetState);
  const algoActiveStatus = useRecoilValue(autoAlgoListState);
  console.log(localSettingData);
  console.log(algoActiveStatus);

  return (
    <Container>
      <ControllerContainer>
        <SearchController />
        <AlgorithmStatus />
        <SearchInfo />
        <LogControllerContainer>LogControllerContainer</LogControllerContainer>
      </ControllerContainer>
      <StatusContainer>StatusContainer</StatusContainer>
    </Container>
  );
}

export default DashBoard;
