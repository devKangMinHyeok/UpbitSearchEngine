import {
  MainContainer,
  MainHeader,
  MainTitle,
} from "../component/mainComponent";
import AutoEngineContainer from "../engines/AutoEngine/AutoEngineContainer";

function Auto() {
  return (
    <MainContainer>
      <MainHeader>
        <MainTitle>Upbit Search Engine</MainTitle>
      </MainHeader>
      <AutoEngineContainer></AutoEngineContainer>
    </MainContainer>
  );
}
export default Auto;
