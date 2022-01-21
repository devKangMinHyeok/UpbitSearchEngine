import { useState } from "react";
import styled from "styled-components";
import MarketCodeSelector from "./MarketCodeSelector";
import SetterController from "./SetterController";

//Setter
const SetterContainer = styled.div`
  border: black 1px solid;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 98%;
  gap: 3px;
  padding: 5px;
`;

function Setter() {
  const [currentMarketCode, setCurrentMarketCode] = useState("");

  return (
    <SetterContainer>
      <MarketCodeSelector
        curMarketCode={currentMarketCode}
        setCurMarketCode={setCurrentMarketCode}
      />
      <SetterController curMarketCode={currentMarketCode} />
    </SetterContainer>
  );
}

export default Setter;
