import copy from "fast-copy";
import { useState } from "react";
import Select from "react-select";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { autoAlgoListState, autoSettingCurAlgoState } from "../../../atoms";
import CustomSwitch from "./CustomSwitch";

const AlgoSelectorContainer = styled.div`
  border: black 1px solid;
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: 250px 100px;
  gap: 20px;
  padding-left: 10px;
`;

const SelectContainer = styled.div`
  width: 100%;
  margin: auto 0;
`;
const OnOffContainer = styled.div`
  width: 100%;
  margin: auto 0;
`;

interface AutoAlgoListProps {
  algo: string;
  active: boolean;
}

function AlgoSelector() {
  const [curAlgo, setCurAlgo] = useRecoilState(autoSettingCurAlgoState);
  const [autoAlgoList, setAutoAlgoList] =
    useRecoilState<AutoAlgoListProps[]>(autoAlgoListState);
  const targetAlgoData = autoAlgoList.find((ele) => curAlgo === ele.algo);
  const curOnOff = targetAlgoData ? targetAlgoData.active : false;

  const options = autoAlgoList.map((ele) => {
    return { value: ele.algo, label: ele.algo };
  });

  const handleOnOff = () => {
    setAutoAlgoList((prev) => {
      const prevState = copy(prev);
      const fixTarget = prevState.find((ele) => ele.algo === curAlgo);
      if (fixTarget) {
        fixTarget.active = !fixTarget.active;
      }
      return prevState;
    });
  };

  const handleSelect = (evt: any) => {
    setCurAlgo(evt.value);
  };

  return (
    <AlgoSelectorContainer>
      <SelectContainer>
        <Select
          value={{ value: curAlgo, label: curAlgo }}
          onChange={handleSelect}
          options={options}
        />
      </SelectContainer>
      <OnOffContainer>
        <CustomSwitch checked={curOnOff} onChange={handleOnOff} />
      </OnOffContainer>
    </AlgoSelectorContainer>
  );
}

export default AlgoSelector;
