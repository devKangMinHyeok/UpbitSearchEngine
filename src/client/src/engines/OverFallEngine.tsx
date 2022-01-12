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
import { fetchCandle } from "../fetchs/api";
import {
  CandleDataProps,
  checkEnvelope,
  getEnvelope,
  getMovingAverage,
  getUrl,
} from "./subAlgorithm";

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const ControllerBox = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Parameters = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Parameter = styled.div`
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.button`
  width: 100px;
  height: 20px;
`;

interface RunBtnProps {
  percent: number;
}

function RunBtn({ percent }: RunBtnProps) {
  const [progressCounter, setProgressCounter] =
    useRecoilState(progressCounterState);
  const [candle, setCandle] = useRecoilState(candleState);
  const overFallMaDays = useRecoilValue(overFallMaDaysState);
  const targetMarketCodes = useRecoilValue(targetMarketCodesState);
  const [searchMarketCodes, setSearchMarketCodes] = useRecoilState(
    searchMarketCodesState
  );

  useEffect(() => {
    const update = targetMarketCodes.map((ele) => {
      const result = {
        marketCode: ele.marketCode,
        market: ele.market,
        search: false,
        match: false,
        envelope: {
          low: false,
          high: false,
        },
      };
      return result;
    });
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
        const result = checkEnvelope(currentCandle, EH, EL);
        setSearchMarketCodes((current: searchMarketCodesProps[]) => {
          const newArr = current.map((ele) => {
            let returnValue: searchMarketCodesProps = {
              marketCode: ele.marketCode,
              market: ele.market,
              search: ele.search,
              match: ele.match,
              envelope: {
                low: ele.envelope.low,
                high: ele.envelope.high,
              },
            };

            if (ele.marketCode === currentMarketCode) {
              if (result === "Nothing") {
                returnValue = {
                  marketCode: ele.marketCode,
                  market: ele.market,
                  search: true,
                  match: false,
                  envelope: {
                    low: ele.envelope.low,
                    high: ele.envelope.high,
                  },
                };
              } else if (result === "Low") {
                returnValue = {
                  marketCode: ele.marketCode,
                  market: ele.market,
                  search: true,
                  match: true,
                  envelope: {
                    low: true,
                    high: ele.envelope.high,
                  },
                };
              } else if (result === "High") {
                returnValue = {
                  marketCode: ele.marketCode,
                  market: ele.market,
                  search: true,
                  match: true,
                  envelope: {
                    low: ele.envelope.low,
                    high: true,
                  },
                };
              } else {
                console.log("Error: Not Low & High & Nothing");
              }
              return returnValue;
            } else {
              return returnValue;
            }
          });
          return newArr;
        });
        setProgressCounter((prev) => prev + 1);
      }
    }
  };

  return (
    <BtnContainer>
      <Btn onClick={handleRun}>Run</Btn>
    </BtnContainer>
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
    <Container>
      <Controller />
    </Container>
  );
}

export default OverFallEngine;
