import { useRecoilState } from "recoil";
import styled from "styled-components";
import { candleState, marketState } from "../atoms";

function Ichimoku() {
  const [candle, setCandle] = useRecoilState(candleState);
  const [market, setMarket] = useRecoilState(marketState);
  return <div>Ichimoku</div>;
}

export default Ichimoku;
