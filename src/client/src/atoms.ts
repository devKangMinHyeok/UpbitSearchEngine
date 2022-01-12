import { atom, selector } from "recoil";

export const candleState = atom({
  key: "candle",
  default: "1day",
});

export const marketState = atom({
  key: "market",
  default: ["KRW", "BTC", "USDT"],
});

export const algorithmState = atom({
  key: "algorithm",
  default: "OverFall",
});

export const progressCounterState = atom({
  key: "progressCounter",
  default: 0,
});

export const currentChartState = atom({
  key: "currentChart",
  default: "",
});

const DEFAULT_MOVING_AVERAGE = 20;
export const overFallMaDaysState = atom({
  key: "overFallMaDays",
  default: DEFAULT_MOVING_AVERAGE,
});

export interface MarketRawProps {
  market: string;
  korean_name: string;
  english_name: string;
}

export const marketCodesRawState = atom({
  key: "marketCodesRaw",
  default: [] as MarketRawProps[],
});

export interface MarketCodesProps {
  marketCode: string;
  market: string;
}

export const filteredMarketCodesState = selector({
  key: "filteredMarketCodes",
  get: ({ get }) => {
    const rawData = get(marketCodesRawState);
    const result = rawData.map((marketCode) => {
      return {
        marketCode: marketCode.market,
        market: marketCode.market.split("-")[0],
      };
    });
    return result;
  },
});

export const targetMarketCodesState = selector({
  key: "targetMarketCodes",
  get: ({ get }) => {
    const marketCodes = get(filteredMarketCodesState);
    const market = get(marketState);
    const result = marketCodes.filter((marketCode) =>
      market.includes(marketCode.market)
    );
    return result;
  },
});

export interface searchMarketCodesProps {
  marketCode: string;
  market: string;
  search: boolean;
  match: boolean;
  envelope: {
    low: boolean;
    high: boolean;
  };
}

export const searchMarketCodesState = atom({
  key: "searchMarketCodes",
  default: [] as searchMarketCodesProps[],
});
