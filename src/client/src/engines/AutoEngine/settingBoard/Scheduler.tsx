import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  AlgoDataProps,
  AutoMarketCodesDataSetProps,
  autoMarketCodesDataSetState,
  autoSettingCurAlgoState,
} from "../../../atoms";

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: whitesmoke;
`;

const TableCategory = styled.div`
  margin: auto auto;
`;

const ScheduleBox = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
`;

const ScheduleElement = styled.div`
  margin: auto auto;
`;
const ScheduleActiveState = styled.div<{ isActive: boolean }>`
  width: 15px;
  height: 15px;
  margin: auto auto;
  background-color: ${(props) => (props.isActive ? "green" : "red")};
  border-radius: 50%;
`;

const SchedulerContainer = styled.div`
  border: black 1px solid;
  grid-row: 2 / span 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
  height: 100%;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #e0e0e0;
  }
  &::-webkit-scrollbar-thumb {
    background: #7c7c7c;
  }
`;

interface ScheduleListProps {
  marketCode: string;
  data: AlgoDataProps;
}

function Scheduler() {
  const [curAlgo, setCurAlgo] = useRecoilState(autoSettingCurAlgoState);
  const [MCDataSet, setMCDataSet] = useRecoilState<
    AutoMarketCodesDataSetProps[]
  >(autoMarketCodesDataSetState);
  const [scheduleList, setScheduleList] = useState<ScheduleListProps[]>();

  useEffect(() => {
    setScheduleList((prev) => {
      const newScheduleList = MCDataSet.map((ele) => {
        const marketCode = ele.marketCode;
        const data = ele.algorithms.find((ele) => ele.id === curAlgo);
        if (marketCode && data) {
          return {
            marketCode: marketCode,
            data: data,
          };
        } else {
          return;
        }
      });

      if (!newScheduleList) {
        return undefined;
      } else {
        newScheduleList.sort((a, b) => {
          if (a && b) {
            let result = 1;
            const detectingOn = a.data.detecting && !b.data.detecting;
            if (detectingOn) result = -1;
            const alarmOn = a.data.alarm && !b.data.alarm;
            if (alarmOn) result = -1;
            return result;
          } else {
            return 1;
          }
        });
        return newScheduleList as ScheduleListProps[];
      }
    });
  }, [curAlgo, MCDataSet]);

  return (
    <SchedulerContainer>
      <TableHeader>
        <TableCategory>Market Code</TableCategory>
        <TableCategory>감시</TableCategory>
        <TableCategory>알림</TableCategory>
      </TableHeader>
      {scheduleList
        ? scheduleList.map((ele) => {
            if (ele) {
              return (
                <ScheduleBox key={ele.marketCode}>
                  <ScheduleElement>{ele.marketCode}</ScheduleElement>
                  <ScheduleActiveState isActive={ele.data.detecting} />
                  <ScheduleActiveState isActive={ele.data.alarm} />
                </ScheduleBox>
              );
            }
          })
        : "Loading"}
    </SchedulerContainer>
  );
}

export default Scheduler;
