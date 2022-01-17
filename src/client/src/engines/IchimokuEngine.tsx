import copy from "fast-copy";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  candleState,
  marketState,
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
} from "../component/ctrComponent";
import { fetchCandle } from "../fetchs/api";
import {
  CandleDataProps,
  checkIchimoku,
  getIchimokuData,
  getUrl,
  searchMarketCodesInit,
} from "./subAlgorithm";

function RunBtn() {
  const [progressCounter, setProgressCounter] =
    useRecoilState(progressCounterState);
  const candle = useRecoilValue(candleState);
  const targetMarketCodes = useRecoilValue(targetMarketCodesState);
  const [searchMarketCodes, setSearchMarketCodes] = useRecoilState(
    searchMarketCodesState
  );

  useEffect(() => {
    const update = searchMarketCodesInit(targetMarketCodes);
    setSearchMarketCodes([...update]);
  }, [targetMarketCodes]);

  const handleRun = async () => {
    const DEFAULT_ICHIMOKU_DAYS = 78;
    const DEFAULT_ICHIMOKU_SET_DAYS = 26;
    setProgressCounter(0);
    if (searchMarketCodes) {
      for (let i = 0; i < searchMarketCodes.length; i++) {
        const currentMarketCode = searchMarketCodes[i].marketCode;
        const url = getUrl(
          candle,
          currentMarketCode,
          DEFAULT_ICHIMOKU_DAYS + 1
        );
        const data: CandleDataProps[] = await fetchCandle(url);
        const currentCandle = data[0];
        const prevCandle = data[1];
        const targetCandles: CandleDataProps[] = data.slice(
          0,
          DEFAULT_ICHIMOKU_DAYS
        );
        const prevCandles: CandleDataProps[] = data.slice(
          1,
          DEFAULT_ICHIMOKU_DAYS + 1
        );
        const targetIchimokuData = getIchimokuData(
          targetCandles,
          DEFAULT_ICHIMOKU_DAYS,
          DEFAULT_ICHIMOKU_SET_DAYS
        );
        const prevIchimokuData = getIchimokuData(
          prevCandles,
          DEFAULT_ICHIMOKU_DAYS,
          DEFAULT_ICHIMOKU_SET_DAYS
        );
        const prevResult = checkIchimoku(prevIchimokuData, prevCandle);
        let result = checkIchimoku(targetIchimokuData, currentCandle);

        if (data.length < 72 || prevResult === "UpSpanThisCandle") {
          result = "Nothing";
        }

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
            case "UpSpanThisCandle":
              if (fixTarget) {
                fixTarget.search = true;
                fixTarget.match = true;
                fixTarget.ichimoku.upSpan = true;
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
  return (
    <ControllerBox>
      <RunBtn />
    </ControllerBox>
  );
}

function IchimokuEngine() {
  return (
    <ControlContainer>
      <Controller />
    </ControlContainer>
  );
}

export default IchimokuEngine;
