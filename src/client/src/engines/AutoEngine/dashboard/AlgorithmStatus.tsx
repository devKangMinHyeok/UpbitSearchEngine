import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { autoAlgoListState, autoAlgoListStateProps } from "../../../atoms";

const AlgoStatusContainer = styled.div`
  height: 100%;
  border: black 1px solid;
  display: grid;
  grid-template-rows: 20px 100px;
`;

const AlgoStatusTableHeader = styled.div`
  width: 100%;
  height: 100%;
  div {
    text-align: center;
  }
  background-color: #dfdfdf;
`;

const AlgoStatusTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
  height: 100%;
  padding-top: 5px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #e0e0e0;
  }
  &::-webkit-scrollbar-thumb {
    background: #7c7c7c;
  }
`;

const AlgoStatusBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  div {
    margin: auto auto;
  }
`;

const ScheduleActiveState = styled.div<{ isActive: boolean }>`
  width: 15px;
  height: 15px;
  margin: auto auto;
  background-color: ${(props) => (props.isActive ? "green" : "red")};
  border-radius: 50%;
`;

function AlgorithmStatus() {
  const algoActiveStatus =
    useRecoilValue<autoAlgoListStateProps[]>(autoAlgoListState);

  return (
    <AlgoStatusContainer>
      <AlgoStatusTableHeader>
        <div>Algorithm</div>
      </AlgoStatusTableHeader>
      <AlgoStatusTable>
        {algoActiveStatus
          ? algoActiveStatus.map((ele) => {
              return (
                <AlgoStatusBox key={ele.algo}>
                  <div>{ele.algo}</div>
                  <ScheduleActiveState isActive={ele.active} />
                </AlgoStatusBox>
              );
            })
          : null}
      </AlgoStatusTable>
    </AlgoStatusContainer>
  );
}

export default AlgorithmStatus;
