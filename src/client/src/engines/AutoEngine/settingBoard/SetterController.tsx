import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  algoDataState,
  AutoMarketCodesDataSetProps,
  autoMarketCodesDataSetState,
  autoSettingCurAlgoState,
  getDefaultAutoMarketCodesDataSet,
  ICHIMOKU_KOREAN_NAME,
  MOVING_AVERAGE_KOREAN_NAME,
  OVERFALL_KOREAN_NAME,
} from "../../../atoms";
import MACtr from "./CustomAlgoCtr/MaCtr";
import CustomSwitch from "./CustomSwitch";

const CANDLE_LIST = ["1day", "1hour", "15min", "5min"];

const ControllerContainer = styled.div`
  padding: 3px;
  border: black 1px solid;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 4fr 1fr;
  gap: 5px;
`;

const MarketCodeContainer = styled.div`
  border: black 1px solid;
`;

const DetectingContainer = styled.div`
  border: black 1px solid;
`;

const AlarmContainer = styled.div`
  border: black 1px solid;
`;

const CandleContainer = styled.div`
  border: black 1px solid;
  grid-row: 2 / span 2;
  display: grid;
  grid-template-rows: 30px 30px 30px 30px;
`;

const CandleBox = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? "red" : "grey")};
`;

interface CandleSelectorProps {
  candle: string;
  setCandle: any;
}

function CandleSelector({ candle, setCandle }: CandleSelectorProps) {
  const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    setCandle(evt.currentTarget.innerText);
  };

  return (
    <CandleContainer>
      {CANDLE_LIST.map((ele) => {
        return (
          <CandleBox key={ele} isActive={ele === candle} onClick={handleClick}>
            <span>{ele}</span>
          </CandleBox>
        );
      })}
    </CandleContainer>
  );
}

const CustomAlgoCtrContainer = styled.div`
  border: black 1px solid;
  grid-column: 2 / span 2;
`;

interface CustomAlgoControllerProps {
  candle: string;
  curMarketCode: string;
}

function CustomAlgoController({
  candle,
  curMarketCode,
}: CustomAlgoControllerProps) {
  const curAlgo = useRecoilValue(autoSettingCurAlgoState);
  switch (curAlgo) {
    case MOVING_AVERAGE_KOREAN_NAME:
      return <MACtr candle={candle} curMarketCode={curMarketCode} />;
    case OVERFALL_KOREAN_NAME:
      return <div>{OVERFALL_KOREAN_NAME}</div>;
    case ICHIMOKU_KOREAN_NAME:
      return <div>{ICHIMOKU_KOREAN_NAME}</div>;
    default:
      return <div>{MOVING_AVERAGE_KOREAN_NAME}</div>;
  }
}

const ResetBtnContainer = styled.div`
  border: black 1px solid;
  grid-column: 2;
`;

const SaveBtnContainer = styled.div`
  border: black 1px solid;
  &:hover {
    cursor: pointer;
  }
`;

// Setter Controller
interface SetterControllerProps {
  curMarketCode: string;
}

function SetterController({ curMarketCode }: SetterControllerProps) {
  const [curAlgo, setCurAlgo] = useRecoilState(autoSettingCurAlgoState);

  // Different by Algo
  const [algoData, setAlgoData] = useRecoilState(algoDataState);

  const [detecting, setDetecting] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [candle, setCandle] = useState("1day");
  const [MCDataSet, setMCDataSet] = useRecoilState<
    AutoMarketCodesDataSetProps[]
  >(autoMarketCodesDataSetState);
  const [curData, setCurData] = useState<AutoMarketCodesDataSetProps>();

  // data loading
  useEffect(() => {
    const exist = MCDataSet.find((ele) => ele.marketCode === curMarketCode);
    if (exist) {
      setCurData(exist);
    } else if (!exist && curMarketCode) {
      const newOne = getDefaultAutoMarketCodesDataSet();
      newOne.marketCode = curMarketCode;
      setMCDataSet((prev) => [...prev, newOne]);
      setCurData(newOne);
    }
  }, [MCDataSet, curMarketCode]);

  // after data loading => UI render
  useEffect(() => {
    if (curData) {
      const curAlgoData = curData.algorithms.find((ele) => ele.id === curAlgo);
      if (curAlgoData) {
        setDetecting(curAlgoData.detecting);
        setAlarm(curAlgoData.alarm);
      } else {
        setDetecting(false);
        setAlarm(false);
      }
    }
  }, [curData, curAlgo]);

  const handleDetecting = () => {
    setDetecting((prev) => !prev);
  };
  const handleAlarm = () => {
    setAlarm((prev) => !prev);
  };

  const handleSave = () => {
    if (curData && curMarketCode) {
      let copyData: AutoMarketCodesDataSetProps =
        {} as AutoMarketCodesDataSetProps;
      setCurData((prev) => {
        if (prev) {
          copyData = copy(prev);
          if (copyData) {
            const curAlgoData = copyData.algorithms.find(
              (ele) => ele.id === curAlgo
            );
            if (curAlgoData) {
              curAlgoData.alarm = alarm;
              curAlgoData.detecting = detecting;
              curAlgoData.candle = algoData.candle;
            }
          }
        }
        return copyData;
      });

      setMCDataSet((prev) => {
        const targetData = copy(prev);
        const constantData = targetData.filter(
          (ele) => ele.marketCode !== curMarketCode
        );
        if (constantData && copyData) {
          const newData = [...constantData, copyData];
          return newData;
        } else {
          return [copyData];
        }
      });
    }
  };

  return (
    <ControllerContainer>
      <MarketCodeContainer>{curMarketCode}</MarketCodeContainer>
      <DetectingContainer>
        <span>감시</span>
        <CustomSwitch checked={detecting} onChange={handleDetecting} />
      </DetectingContainer>
      <AlarmContainer>
        <span>알림</span>
        <CustomSwitch checked={alarm} onChange={handleAlarm} />
      </AlarmContainer>
      <CandleSelector candle={candle} setCandle={setCandle} />
      <CustomAlgoCtrContainer>
        <CustomAlgoController candle={candle} curMarketCode={curMarketCode} />
      </CustomAlgoCtrContainer>
      <ResetBtnContainer>ResetBtnContainer</ResetBtnContainer>
      <SaveBtnContainer onClick={handleSave}>Save</SaveBtnContainer>
    </ControllerContainer>
  );
}

export default SetterController;
