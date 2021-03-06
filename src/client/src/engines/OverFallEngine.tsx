import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  candleState,
  overFallMaDaysState,
  progressCounterState,
  searchMarketCodesProps,
  searchMarketCodesState,
  targetMarketCodesState,
} from "../atoms";
import {
  ControlContainer,
  ControllerBox,
  CtrBtn,
  CtrBtnContainer,
  Parameter,
  Parameters,
} from "../component/ctrComponent";
import { fetchCandle } from "../fetchs/api";
import {
  CandleDataProps,
  checkEnvelope,
  getEnvelope,
  getMovingAverage,
  getUrl,
  searchMarketCodesInit,
} from "./subAlgorithm";

interface RunBtnProps {
  percent: number;
}

function RunBtn({ percent }: RunBtnProps) {
  const [progressCounter, setProgressCounter] =
    useRecoilState(progressCounterState);
  const candle = useRecoilValue(candleState);
  const overFallMaDays = useRecoilValue(overFallMaDaysState);
  const targetMarketCodes = useRecoilValue(targetMarketCodesState);
  const [searchMarketCodes, setSearchMarketCodes] = useRecoilState(
    searchMarketCodesState
  );

  useEffect(() => {
    const update = searchMarketCodesInit(targetMarketCodes);
    setSearchMarketCodes([...update]);
  }, [targetMarketCodes]);

  const handleRun = async () => {
    setProgressCounter(0);
    if (searchMarketCodes) {
      for (let i = 0; i < searchMarketCodes.length; i++) {
        const currentMarketCode = searchMarketCodes[i].marketCode;
        const url = getUrl(candle, currentMarketCode, overFallMaDays);
        const data: CandleDataProps[] = await fetchCandle(url);
        const MA = getMovingAverage(data, overFallMaDays);
        const { EH, EL } = getEnvelope(MA, percent);
        const currentCandle = data[0];
        let result = checkEnvelope(currentCandle, EH, EL);
        if (data.length < overFallMaDays) result = "Nothing";

        setSearchMarketCodes((current: searchMarketCodesProps[]) => {
          const canEditCurrent = copy(current);
          const fixTarget = canEditCurrent.find(
            (ele) => ele.marketCode === currentMarketCode
          );
          switch (result) {
            case "Nothing":
              if (fixTarget) {
                fixTarget.search = true;
                fixTarget.match = false;
              }

              break;
            case "Low":
              if (fixTarget) {
                fixTarget.search = true;
                fixTarget.match = true;
                fixTarget.envelope.low = true;
              }
              break;
            case "High":
              if (fixTarget) {
                fixTarget.search = true;
                fixTarget.match = true;
                fixTarget.envelope.high = true;
              }
              break;
            default:
              console.log("Error: No result Envelope");
              break;
          }
          return [...canEditCurrent];
        });
        setProgressCounter((prev) => prev + 1);
      }
    }
  };

  return (
    <CtrBtnContainer>
      <CtrBtn onClick={handleRun}>Run</CtrBtn>
    </CtrBtnContainer>
  );
}

function Controller() {
  const DEFAULT_PERCENT = 20;
  const [overFallMaDays, setOverFallMaDays] =
    useRecoilState(overFallMaDaysState);
  const [percent, setPercent] = useState(DEFAULT_PERCENT);

  const handleMaDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverFallMaDays(Number(event.target.value));
  };

  const handlePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(Number(event.target.value));
  };

  return (
    <ControllerBox>
      <Parameters>
        <Parameter>
          <label htmlFor="moving-average">MA(Moving Average) days</label>
          <input
            type="number"
            id="moving-average"
            name="moving-average"
            min={10}
            max={40}
            value={overFallMaDays}
            onChange={handleMaDays}
          />
        </Parameter>
        <Parameter>
          <label htmlFor="percent">Percent</label>
          <input
            type="number"
            id="percent"
            name="percent"
            min={10}
            max={40}
            value={percent}
            onChange={handlePercent}
          />
        </Parameter>
      </Parameters>
      <RunBtn percent={percent} />
    </ControllerBox>
  );
}

function OverFallEngine() {
  return (
    <ControlContainer>
      <Controller />
    </ControlContainer>
  );
}

export default OverFallEngine;
