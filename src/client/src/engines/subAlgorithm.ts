import { MarketCodesProps } from "../atoms";

export const searchMarketCodesInit = (
  targetMarketCodes: MarketCodesProps[]
) => {
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
      ichimoku: {
        upSpan: false,
      },
    };
    return result;
  });
  return update;
};

export interface CandleDataProps {
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
}

export const getUrl = (candle: string, marketCode: string, days: number) => {
  let url = "";
  let candleType = "";
  const DEFAULT_URL = "https://api.upbit.com";
  if (candle === "4hour") {
    candleType = "240";
  } else if (candle === "1hour") {
    candleType = "60";
  } else if (candle === "15min") {
    candleType = "15";
  } else if (candle === "5min") {
    candleType = "5";
  }

  if (candle === "1day") {
    url = `/v1/candles/days?market=${marketCode}&count=${days}`;
  } else {
    url = `/v1/candles/minutes/${candleType}?market=${marketCode}&count=${days}`;
  }

  return url;
};

export const getMovingAverage = (data: CandleDataProps[], days: number) => {
  let sum = 0;
  let avr = 0;

  data.forEach((e) => {
    sum += e.trade_price;
  });
  avr = sum / days;

  return avr;
};

export const getEnvelope = (avr: number, prt: number) => {
  const envelopeHigh = avr * (100 + prt) * 0.01;
  const envelopeLow = avr * (100 - prt) * 0.01;

  return { EH: envelopeHigh, EL: envelopeLow };
};

export const checkEnvelope = (
  candle: CandleDataProps,
  eHigh: number,
  eLow: number
) => {
  if (candle.low_price <= eLow) {
    // console.log("Envelope Low!!");
    return "Low";
  } else if (candle.high_price >= eHigh) {
    // console.log("Envelope High!!");
    return "High";
  } else {
    // console.log("inner Envelope");
    return "Nothing";
  }
};

export const getEnvelopeData = () => {};

export const getEnvelopeDataSet = (
  candleSet: CandleDataProps[],
  maDays: number,
  percent: number
) => {
  if (candleSet.length < maDays) {
    return;
  }
  for (let i = 0; i < candleSet.length - maDays; i++) {}
};

const getHighPrice = (data: CandleDataProps[]) => {
  let highPrice = 0;
  for (let i = 0; i < data.length; i++) {
    const currentCandle = data[i];
    if (currentCandle.high_price > highPrice)
      highPrice = currentCandle.high_price;
  }
  return highPrice;
};

const getLowPrice = (data: CandleDataProps[]) => {
  let lowPrice = 1000000000000;
  for (let i = 0; i < data.length; i++) {
    const currentCandle = data[i];
    if (currentCandle.low_price < lowPrice) lowPrice = currentCandle.low_price;
  }
  return lowPrice;
};

const getIchimokuLine = (data: CandleDataProps[]) => {
  const lowPrice = getLowPrice(data);
  const highPrice = getHighPrice(data);
  const IchimokueLinePrice = (highPrice + lowPrice) / 2;

  return IchimokueLinePrice;
};

export const getIchimokuData = (
  data: CandleDataProps[],
  DEFAULT_ICHIMOKU_DAYS: number,
  DEFAULT_ICHIMOKU_SET_DAYS: number
) => {
  const conversionCandle = data.slice(
    DEFAULT_ICHIMOKU_SET_DAYS,
    DEFAULT_ICHIMOKU_SET_DAYS + 9
  );
  const baseCandle = data.slice(
    DEFAULT_ICHIMOKU_SET_DAYS,
    DEFAULT_ICHIMOKU_SET_DAYS + 26
  );
  const LeadTwoCandle = data.slice(
    DEFAULT_ICHIMOKU_SET_DAYS,
    DEFAULT_ICHIMOKU_SET_DAYS + 52
  );

  const conversion = getIchimokuLine(conversionCandle);
  const base = getIchimokuLine(baseCandle);
  const leadOne = (conversion + base) / 2;
  const leadTwo = getIchimokuLine(LeadTwoCandle);

  return {
    conversion,
    base,
    leadOne,
    leadTwo,
  };
};

interface IchimokuDataProps {
  conversion: number;
  base: number;
  leadOne: number;
  leadTwo: number;
}

export const checkIchimoku = (
  ichimokuData: IchimokuDataProps,
  currentCandle: CandleDataProps
) => {
  const isUpThanLeadOne = currentCandle.high_price >= ichimokuData.leadOne;
  const isUpThanLeadTwo = currentCandle.high_price >= ichimokuData.leadTwo;
  if (isUpThanLeadOne && isUpThanLeadTwo) {
    return "UpSpanThisCandle";
  } else {
    return "Nothing";
  }
};
