import ApexCharts from "react-apexcharts";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, Route, Switch, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  algorithmState,
  candleState,
  currentChartState,
  marketCodesRawState,
  MarketRawProps,
  marketState,
  overFallMaDaysState,
  progressCounterState,
  searchMarketCodesState,
  targetMarketCodesState,
} from "../atoms";
import { fetchCandle, fetchMarketCodes } from "../fetchs/api";
import IchimokuEngine from "./IchimokuEngine";
import OverFallEngine from "./OverFallEngine";
import { CandleDataProps, getUrl } from "./subAlgorithm";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 1fr;
  grid-template-rows: 20vh 10vh 60vh;
  gap: 10px;
  padding: 10px;
  padding-right: 20px;
`;

// CandleSelector Component
const SCandleSelector = styled.div`
  border: 1px solid black;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  label {
    &:hover {
      cursor: pointer;
    }
  }
`;

function CandleSelector() {
  const candleList = ["1day", "4hour", "1hour", "15min", "5min"];
  const [candle, setCandle] = useRecoilState(candleState);
  const handleCandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCandle(event.target.value);
  };
  return (
    <SCandleSelector>
      <h3>Candle</h3>
      <RadioContainer>
        {candleList.map((element) => {
          return (
            <label htmlFor={element} key={element}>
              <input
                id={element}
                value={element}
                name="candle"
                type={"radio"}
                checked={candle === element}
                onChange={handleCandleChange}
              />

              {element}
            </label>
          );
        })}
      </RadioContainer>
    </SCandleSelector>
  );
}

// MarketSelector Component
const SMarketSelector = styled.div`
  border: 1px solid black;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  label {
    &:hover {
      cursor: pointer;
    }
  }
`;

function MarketSelector() {
  const marketList = ["KRW", "BTC", "USDT"];
  const [market, setMarket] = useRecoilState(marketState);

  const handleMarketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const clicked = event.target.value;
    setMarket((current: string[]) => {
      if (current.includes(clicked)) {
        return current.filter((e) => e != clicked);
      } else {
        return [...current, clicked];
      }
    });
  };

  return (
    <SMarketSelector>
      <h3>Market</h3>
      <CheckBoxContainer>
        {marketList.map((element) => {
          return (
            <label key={element} htmlFor={element}>
              <input
                id={element}
                type="checkbox"
                name="market"
                value={element}
                checked={market.includes(element)}
                onChange={handleMarketChange}
              />
              {element}
            </label>
          );
        })}
      </CheckBoxContainer>
    </SMarketSelector>
  );
}

// Algorithm Selector Component
const OVER_FALL = "OverFall";
const ICHIMOKU = "Ichimoku";

const SAlgoSelector = styled.div`
  border: 1px solid black;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 5px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
  color: ${(props) => (props.isActive ? "orange" : "black")};
  a {
    display: block;
  }
`;

interface RouteParams {
  algorithm: string;
}

function AlgoSelector() {
  const algorithmList = [OVER_FALL, ICHIMOKU];
  const [algorithm, setAlgorithm] = useRecoilState(algorithmState);
  const { algorithm: params } = useParams<RouteParams>();

  const handleAlgoChange = (event: React.ChangeEvent<HTMLButtonElement>) => {
    setAlgorithm(event.target.value);
  };

  return (
    <SAlgoSelector>
      <Tabs>
        {algorithmList.map((algo) => {
          return (
            <Tab key={algo} isActive={algo === params ? true : false}>
              <Link to={`/manual/${algo}`}>{algo}</Link>
            </Tab>
          );
        })}
      </Tabs>
    </SAlgoSelector>
  );
}

//Engine Info Component
const EngineInfoContainer = styled.div`
  border: 1px solid black;
  grid-column: -2;
  grid-row: 1 / span 2;
`;

function EngineInfo() {
  const progressCounter = useRecoilValue(progressCounterState);
  const searchMarketCodes = useRecoilValue(searchMarketCodesState);
  return (
    <EngineInfoContainer>
      <div>
        <span>Progress: </span>
        <span>
          {progressCounter}/{searchMarketCodes.length}
        </span>
      </div>
      <div>
        <div>Updated Time: </div>
        <div>
          {progressCounter === searchMarketCodes.length && progressCounter !== 0
            ? dayjs().format("DD/MM/YYYY HH:mm:ss")
            : ""}
        </div>
      </div>
    </EngineInfoContainer>
  );
}

//Algorithm Controller Component
const SAlgoController = styled.div`
  grid-column: 1 / span 3;
  border: 1px solid black;
`;

function AlgoReturn() {
  const [algorithm, setAlgorithm] = useRecoilState(algorithmState);
  switch (algorithm) {
    case OVER_FALL:
      return <OverFallEngine />;
    case ICHIMOKU:
      return <IchimokuEngine />;
    default:
      return <></>;
  }
}

function AlgoController() {
  const [algorithm, setAlgorithm] = useRecoilState(algorithmState);
  const { algorithm: params } = useParams<RouteParams>();
  useEffect(() => {
    setAlgorithm(params);
  }, [params]);
  return (
    <SAlgoController>
      <Switch>
        <Route path={`/manual/${params}`}>
          <AlgoReturn></AlgoReturn>
        </Route>
      </Switch>
    </SAlgoController>
  );
}

// MarketCode Table Component
const MarketCodeTableContainer = styled.div`
  border: 1px solid black;
`;

const MarketCodesTable = styled.div`
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

const MarketCodeBox = styled.div<{ search: boolean; match: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  background-color: ${(props) =>
    props.search ? (props.match ? "#403dff" : "#b6b6b6") : "#ffffff"};
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

function MarketCodeTable() {
  const { isLoading: marketCodesLoading, data } = useQuery<MarketRawProps[]>(
    ["marketCode"],
    () => fetchMarketCodes()
  );
  const [marketCodesData, setMarketCodesData] =
    useRecoilState(marketCodesRawState);
  const searchMarketCodes = useRecoilValue(searchMarketCodesState);

  useEffect(() => {
    if (!marketCodesLoading && data) setMarketCodesData(data);
  }, [marketCodesLoading, data]);

  return (
    <MarketCodeTableContainer>
      {marketCodesLoading ? (
        "Loading"
      ) : (
        <MarketCodesTable>
          {searchMarketCodes?.map((ele) => {
            return (
              <MarketCodeBox
                key={ele.marketCode}
                search={ele.search}
                match={ele.match}
              >
                <span>{ele.marketCode}</span>
              </MarketCodeBox>
            );
          })}
        </MarketCodesTable>
      )}
    </MarketCodeTableContainer>
  );
}

// ResultTable Component
const ResultTableContainer = styled.div`
  border: 1px solid black;
`;

const ResultMarketCodeBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  background-color: #ffe0bd;
  &:hover {
    cursor: pointer;
    background-color: #ffb35d;
  }
`;

function ResultTable() {
  const searchMarketCodes = useRecoilValue(searchMarketCodesState);
  const [currentChart, setCurrentChart] = useRecoilState(currentChartState);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setCurrentChart(event.currentTarget.innerText);
  };

  return (
    <ResultTableContainer>
      <MarketCodesTable>
        {searchMarketCodes?.map((ele) => {
          if (ele.match) {
            return (
              <ResultMarketCodeBox key={ele.marketCode} onClick={handleClick}>
                <span>{ele.marketCode}</span>
              </ResultMarketCodeBox>
            );
          }
        })}
      </MarketCodesTable>
    </ResultTableContainer>
  );
}

//Chart Component
const ChartContainer = styled.div`
  grid-column: 3 / span 2;
  border: 1px solid black;
`;

function Chart() {
  const DISPLAY_CANDLE_NUMBER = 200;
  const currentChart = useRecoilValue(currentChartState);
  const candle = useRecoilValue(candleState);
  const overFallMaDays = useRecoilValue(overFallMaDaysState);
  const url = getUrl(candle, currentChart, DISPLAY_CANDLE_NUMBER);
  const [tohlc, setTohlc] = useState([[0, 0, 0, 0, 0]]);

  const { isLoading, data } = useQuery<CandleDataProps[]>(
    ["candleData", currentChart, candle],
    async () => await fetchCandle(url),
    {
      refetchInterval: 30000,
    }
  );

  useEffect(() => {
    if (!isLoading && data) {
      const filteredData = data.map((candle: CandleDataProps) => {
        const result = [
          candle.timestamp,
          candle.opening_price,
          candle.high_price,
          candle.low_price,
          candle.trade_price,
        ];
        return result;
      });
      setTohlc([...filteredData]);
      console.log(filteredData);
    }
  }, [data]);

  return (
    <ChartContainer>
      <span>{currentChart}</span>
      {!isLoading ? (
        <ApexCharts
          type="candlestick"
          width={"100%"}
          height={"95%"}
          series={[
            {
              data: tohlc,
            },
          ]}
          options={{
            chart: {
              id: "candle-chart",
              animations: {
                enabled: false,
              },
            },
            plotOptions: {
              candlestick: {
                wick: {
                  useFillColor: true,
                },
              },
            },
            xaxis: {
              type: "datetime",
              categories: tohlc?.map((ele) => ele[0]),
            },
          }}
        ></ApexCharts>
      ) : null}
    </ChartContainer>
  );
}

function EngineContainer() {
  const currentChart = useRecoilValue(currentChartState);
  return (
    <Container>
      <CandleSelector />
      <MarketSelector />
      <AlgoSelector />
      <EngineInfo />
      <AlgoController />
      <MarketCodeTable />
      <ResultTable />
      {currentChart !== "" ? <Chart /> : null}
    </Container>
  );
}

export default EngineContainer;
