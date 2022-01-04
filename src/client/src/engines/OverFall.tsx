import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMarketCodes, overFallAlgo } from "../fetchs/fetchData";

const Container = styled.div``;

const MarketCodesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  border: 1px solid black;
  padding: 10px;
`;

const ControllerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  input {
    margin-left: 10px;
  }
`;

const ProgressBox = styled.div``;

const MarketCodeBox = styled.div`
  border-radius: 5%;
  background-color: ${(props) => props.color};
  width: fit-content;
  padding: 5px;
`;

interface IOverFall {
  candle: string;
  market: string[];
}

export interface MarketCode {
  market: string;
  ticker: string;
  marketCode: string;
}

interface MarketCodesData {
  BTCMarket: MarketCode[];
  KRWMarket: MarketCode[];
  USDTMarket: MarketCode[];
  marketCodes: MarketCode[];
}

export interface SearchMarketCodes {
  market: string;
  ticker: string;
  marketCode: string;
  search: boolean;
  match: boolean;
  lowHigh: boolean;
}

function OverFall({ candle, market }: IOverFall) {
  const DEFAULT_MOVING_AVERAGE = 20;
  const DEFAULT_PERCENT = 20;

  const [marketCodesData, setMarketCodesData] = useState<MarketCodesData>();
  const [activeMarketCodes, setActiveMarketCodes] = useState<MarketCode[]>([]);
  const [searchMarketCodes, setSearchMarketCodes] = useState<
    SearchMarketCodes[]
  >([]);
  const [progressCounter, setProgressCounter] = useState(0);
  const [movingAverage, setMovingAverage] = useState(DEFAULT_MOVING_AVERAGE);
  const [percent, setPercent] = useState(DEFAULT_PERCENT);

  // Overfall Algorithm
  useEffect(() => {
    (async () => {
      const data = await getMarketCodes();
      setMarketCodesData(data);
    })();
  }, []);

  useEffect(() => {
    if (marketCodesData) {
      const active = marketCodesData.marketCodes.filter((ele) =>
        market.includes(ele.market)
      );
      setActiveMarketCodes(active);
    }
  }, [market, marketCodesData]);

  useEffect(() => {
    if (activeMarketCodes) {
      const search = activeMarketCodes.map((ele) => {
        return {
          market: ele.market,
          ticker: ele.ticker,
          marketCode: ele.marketCode,
          search: false,
          match: false,
          lowHigh: false,
        };
      });
      setSearchMarketCodes(search);
    }
  }, [activeMarketCodes]);

  const handleMovingAverage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setMovingAverage(Number(event.target.value));
  };
  const handlePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setPercent(Number(event.target.value));
  };

  const handleRun = async () => {
    await overFallAlgo(
      candle,
      movingAverage,
      percent,
      activeMarketCodes,
      searchMarketCodes,
      setSearchMarketCodes,
      setProgressCounter
    );
  };

  return (
    <Container>
      <ControllerBox>
        <label htmlFor="moving-average">
          MA(Moving Average) days
          <input
            type="number"
            id="moving-average"
            name="moving-average"
            min={10}
            max={40}
            value={movingAverage}
            onChange={handleMovingAverage}
          />
        </label>
        <label htmlFor="percent">
          Percent
          <input
            type="number"
            id="percent"
            name="percent"
            min={10}
            max={40}
            value={percent}
            onChange={handlePercent}
          />
        </label>
        <button onClick={handleRun}>Run</button>
      </ControllerBox>
      <ProgressBox>
        <span>{`Progress(${progressCounter}/${activeMarketCodes?.length})`}</span>
      </ProgressBox>
      <MarketCodesContainer>
        {searchMarketCodes
          ? searchMarketCodes?.map((ele) => {
              if (!ele.search) {
                return (
                  <MarketCodeBox key={ele.marketCode} color="#adadad68">
                    {ele.marketCode}
                  </MarketCodeBox>
                );
              } else {
                if (ele.match) {
                  if (ele.lowHigh) {
                    return (
                      <MarketCodeBox key={ele.marketCode} color="#ff484868">
                        {ele.marketCode}
                      </MarketCodeBox>
                    );
                  } else {
                    return (
                      <MarketCodeBox key={ele.marketCode} color="#3aff7568">
                        {ele.marketCode}
                      </MarketCodeBox>
                    );
                  }
                } else {
                  return null;
                }
              }
            })
          : "Loading"}
      </MarketCodesContainer>
    </Container>
  );
}

export default OverFall;
