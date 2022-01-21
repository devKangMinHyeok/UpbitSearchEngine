import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  algoDataState,
  AutoMarketCodesDataSetProps,
  autoMarketCodesDataSetState,
  autoSettingCurAlgoState,
} from "../../../../atoms";
import CustomSwitch from "../CustomSwitch";

const MaCtrContainer = styled.div``;

const MaNumberBox = styled.div``;

const AlarmSectorBox = styled.div``;

interface MACtrProps {
  candle: string;
  curMarketCode: string;
}

function MaCtr({ candle, curMarketCode }: MACtrProps) {
  const [curAlgo, setCurAlgo] = useRecoilState(autoSettingCurAlgoState);
  const [algoData, setAlgoData] = useRecoilState(algoDataState);
  const [MCDataSet, setMCDataSet] = useRecoilState<
    AutoMarketCodesDataSetProps[]
  >(autoMarketCodesDataSetState);
  const [curData, setCurData] = useState<AutoMarketCodesDataSetProps>();
  const [alarmSector, setAlarmSector] = useState(0.1);
  const [ma1Value, setMa1Value] = useState(0);
  const [ma2Value, setMa2Value] = useState(0);
  const [ma1On, setMa1On] = useState(false);
  const [ma2On, setMa2On] = useState(false);

  const handleAlarmSector = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAlarmSector(Number(evt.currentTarget.value));
  };
  const handleMa1Value = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMa1Value(Number(evt.currentTarget.value));
  };
  const handleMa2Value = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMa2Value(Number(evt.currentTarget.value));
  };
  const handleMa1On = () => {
    setMa1On((prev) => !prev);
  };
  const handleMa2On = () => {
    setMa2On((prev) => !prev);
  };

  useEffect(() => {
    const exist = MCDataSet.find((ele) => ele.marketCode === curMarketCode);
    if (exist) {
      setCurData(exist);
    }
  }, [MCDataSet, curMarketCode]);

  useEffect(() => {
    if (curData) {
      const curAlgoData = curData.algorithms.find((ele) => ele.id === curAlgo);
      if (curAlgoData) {
        setAlgoData(curAlgoData);
      }
    }
  }, [curData]);

  useEffect(() => {
    if (algoData.candle) {
      const copyData = copy(algoData);
      const curCandleData = copyData.candle.find((ele) => ele.id === candle);
      const localMa1 = curCandleData?.detail.find((ele) => ele.id === "ma1");
      const localMa2 = curCandleData?.detail.find((ele) => ele.id === "ma2");

      if (curCandleData && localMa1 && localMa2) {
        setAlarmSector(curCandleData.alarmSector);
        setMa1Value(localMa1.data.maNumber);
        setMa2Value(localMa2.data.maNumber);
        setMa1On(localMa1.on);
        setMa2On(localMa2.on);
      }
    }
  }, [algoData, candle]);

  useEffect(() => {
    if (algoData.candle) {
      setAlgoData((prev) => {
        const copyData = copy(prev);
        const curCandleData = copyData.candle.find((ele) => ele.id === candle);
        if (curCandleData) {
          const localMa1 = curCandleData.detail.find((ele) => ele.id === "ma1");
          const localMa2 = curCandleData.detail.find((ele) => ele.id === "ma2");

          curCandleData.alarmSector = alarmSector;
          if (localMa1) localMa1.on = ma1On;
          if (localMa2) localMa2.on = ma2On;
          if (localMa1) localMa1.data.maNumber = ma1Value;
          if (localMa2) localMa2.data.maNumber = ma2Value;
        }
        return copyData;
      });
    }
  }, [alarmSector, ma1Value, ma2Value, ma1On, ma2On]);

  return (
    <MaCtrContainer>
      <MaNumberBox>
        <input
          type={"number"}
          max={300}
          min={0}
          value={ma1Value}
          onChange={handleMa1Value}
        />
        <CustomSwitch checked={ma1On} onChange={handleMa1On} />
      </MaNumberBox>
      <MaNumberBox>
        <input
          type={"number"}
          max={300}
          min={0}
          value={ma2Value}
          onChange={handleMa2Value}
        />
        <CustomSwitch checked={ma2On} onChange={handleMa2On} />
      </MaNumberBox>
      <AlarmSectorBox>
        <input
          type={"number"}
          max={5.0}
          min={0.1}
          step={0.1}
          value={alarmSector}
          onChange={handleAlarmSector}
        />
      </AlarmSectorBox>
    </MaCtrContainer>
  );
}

export default MaCtr;
