import styled from "styled-components";
import AlgoSelector from "./AlgoSelector";
import Scheduler from "./Scheduler";
import Setter from "./Setter";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 10px;
  padding-right: 20px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 10vh 70vh;
`;

function SettingBoard() {
  return (
    <Container>
      <AlgoSelector />
      <Scheduler />
      <Setter />
    </Container>
  );
}

export default SettingBoard;
