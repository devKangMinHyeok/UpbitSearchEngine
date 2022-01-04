import React, { useState } from "react";
import styled from "styled-components";
import Envelope from "./Envelope";
import OverFall from "./OverFall";

const OVER_FALL = "OverFall";

const Container = styled.div`
  display: grid;
  gap: 10px;
`;

// CandleSelector Component
const SCandleSelector = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RadioContainer = styled.div`
  label {
    &:hover {
      cursor: pointer;
    }
  }
`;

interface ICandleSelector {
  candle: string;
  setCandle: any;
}

function CandleSelector({ candle, setCandle }: ICandleSelector) {
  const candleList = ["1day", "4hour", "1hour", "15min", "5min"];

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CheckBoxContainer = styled.div`
  label {
    &:hover {
      cursor: pointer;
    }
  }
`;

interface IMarketSelector {
  market: string[];
  setMarket: any;
}

function MarketSelector({ market, setMarket }: IMarketSelector) {
  const marketList = ["KRW", "BTC", "USDT"];

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
const SAlgoSelector = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface IAlgoSelector {
  algorithm: string;
  setAlgorithm: any;
  algorithmList: string[];
}

function AlgoSelector({
  algorithm,
  setAlgorithm,
  algorithmList,
}: IAlgoSelector) {
  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);
  };

  return (
    <SAlgoSelector>
      <label htmlFor="algorithm-select">
        <h3>Algorithm</h3>
        <select
          name="algorithm"
          id="algorithm-select"
          onChange={handleAlgoChange}
        >
          {algorithmList.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
      </label>
    </SAlgoSelector>
  );
}

//Algorithm Controller Component
const SAlgoController = styled.div``;

interface IAlgoController {
  algorithm: string;
  candle: string;
  market: string[];
}

function AlgoController({ algorithm, candle, market }: IAlgoController) {
  return (
    <SAlgoController>
      {algorithm === OVER_FALL ? (
        <OverFall candle={candle} market={market}></OverFall>
      ) : null}
    </SAlgoController>
  );
}

const SProgress = styled.div``;

const SResult = styled.div``;

function EngineContainer() {
  const algorithmList = [OVER_FALL, "test"];
  const [candle, setCandle] = useState("1day");
  const [market, setMarket] = useState(["KRW", "BTC", "USDT"]);
  const [algorithm, setAlgorithm] = useState(OVER_FALL);

  return (
    <Container>
      <CandleSelector candle={candle} setCandle={setCandle}></CandleSelector>
      <MarketSelector market={market} setMarket={setMarket}></MarketSelector>
      <AlgoSelector
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        algorithmList={algorithmList}
      ></AlgoSelector>
      <AlgoController
        algorithm={algorithm}
        candle={candle}
        market={market}
      ></AlgoController>
    </Container>
  );
}

export default EngineContainer;
