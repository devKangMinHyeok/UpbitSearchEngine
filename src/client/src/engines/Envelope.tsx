import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  checkEnvelope,
  fetchDayCandle,
  getEnvelope,
  getMarketCodes,
  getMovingAverage,
} from "../fetchs/envelope";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
`;

const ListContainer = styled.ul`
  background-color: gray;
  width: 100%;
`;

const Button = styled.button``;

const Progress = styled.div``;

type EnvelopeProps = {
  movingAverage: number;
  percent: number;
};

interface MarketCodes {
  market: string;
  korean_name: string;
  english_name: string;
}

interface CandleData {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  unit: number;
}

function Envelope({ movingAverage, percent }: EnvelopeProps) {
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(false);
  const [index, setIndex] = useState(0);
  const [marketCodes, setMarketCodes] = useState<MarketCodes[]>([]);
  const [envelopeLowMC, setEnvelopeLowMC] = useState<MarketCodes[]>([]);
  useEffect(() => {
    (async () => {
      setEnvelopeLowMC([]);
      setIndex(0);
      setLoading(true);
      if (run) {
        console.log("Start!!");
        const MCs: MarketCodes[] = await getMarketCodes();
        setMarketCodes(MCs);
        console.log(MCs);
        for (let i = 0; i < MCs.length; i++) {
          setIndex(i + 1);
          const data = await fetchDayCandle(MCs[i].market, movingAverage);
          const MA = getMovingAverage(data, movingAverage);
          const { EH, EL } = getEnvelope(MA, percent);
          const currentCandle = data[0];
          const result = checkEnvelope(currentCandle, EH, EL);
          if (result === "Low") {
            setEnvelopeLowMC((current) => [...current, MCs[i]]);
          }
        }
        setLoading(false);
      }
    })();
  }, [run]);

  return (
    <Container>
      <Title>Envelope</Title>
      {run ? (
        <Button
          onClick={() => {
            setRun(false);
          }}
        >
          Reset
        </Button>
      ) : (
        <Button
          onClick={() => {
            setRun(true);
          }}
        >
          Run
        </Button>
      )}

      <Progress>
        <span>State: </span>
        <span>
          {run
            ? loading
              ? `loading(${index}/${marketCodes.length})`
              : "done"
            : "ready"}
        </span>
      </Progress>
      <ListContainer>
        {envelopeLowMC.map((element) => (
          <li key={element.market}>{element.market}</li>
        ))}
      </ListContainer>
    </Container>
  );
}

export default Envelope;
