import { SearchMarketCodes } from "../engines/OverFall";

// MarketCode getter Function
interface MarketRaw {
  market: string;
  korean_name: string;
  english_name: string;
}

interface MarketCode {
  market: string;
  ticker: string;
  marketCode: string;
}

export const getMarketCodes = async () => {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const response = await fetch(`/v1/market/all?isDetails=false`, options);
  const json = await response.json();
  const marketCodes = json.map((marketRaw: MarketRaw) => {
    const [market, ticker] = marketRaw.market.split("-");
    const marketCode = marketRaw.market;
    return {
      market,
      ticker,
      marketCode,
    };
  });
  const KRWMarket = marketCodes.filter(
    (marketCode: MarketCode) => marketCode.market === "KRW"
  );
  const BTCMarket = marketCodes.filter(
    (marketCode: MarketCode) => marketCode.market === "BTC"
  );
  const USDTMarket = marketCodes.filter(
    (marketCode: MarketCode) => marketCode.market === "USDT"
  );

  return { marketCodes, KRWMarket, BTCMarket, USDTMarket };
};

//get Url Function
export const getUrl = (candle: string, marketCode: string, days: number) => {
  let url = "";
  let candleType = "";

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

// sleep & waitApiRemain Function
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const waitApiRemain = (response: any) => {
  const remainString = response.headers.get("remaining-req");
  if (remainString === null) {
    return 0;
  }
  let words = remainString.split(";");
  words = words.map((word: string) => word.trim());
  const min = words[1].split("=");
  const sec = words[2].split("=");
  const remainMin = Number(min[1]);
  const remainSec = Number(sec[1]);

  if (remainSec === 0) {
    return 1000;
  }
  if (remainMin === 0) {
    return 60000;
  }
  return 0;
};

// fetch Function
export const fetchDayCandle = async (url: string) => {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const response = await fetch(url, options);
  const sleepTime = waitApiRemain(response);

  if (sleepTime !== 0) {
    await sleep(sleepTime);
  }

  const json = await response.json();

  return json;
};

// OverFall Algorithm
interface ICandleData {
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

export const getMovingAverage = (data: ICandleData[], days: number) => {
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
  candle: ICandleData,
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

// interface SearchMarketCodes {
//   market: string;
//   ticker: string;
//   marketCode: string;
//   search: boolean;
//   match: boolean;
// }

export const overFallAlgo = async (
  candle: string,
  maDays: number,
  percent: number,
  MarketCode: MarketCode[],
  searchMarketCodes: SearchMarketCodes[],
  setSearchMarketCodes: any,
  setProgressCounter: any
) => {
  const marketCodes = MarketCode;
  if (marketCodes && searchMarketCodes) {
    for (let i = 0; i < marketCodes.length; i++) {
      // console.log(`${marketCodes[i].market} Analysis...`);
      const currentMarketCode = marketCodes[i].marketCode;
      const url = getUrl(candle, currentMarketCode, maDays);
      const data = await fetchDayCandle(url);
      const MA = getMovingAverage(data, maDays);
      const { EH, EL } = getEnvelope(MA, percent);

      const currentCandle = data[0];

      const result = checkEnvelope(currentCandle, EH, EL);
      setSearchMarketCodes((current: SearchMarketCodes[]) => {
        const newArr = current.map((ele) => {
          let returnValue: SearchMarketCodes = {
            market: ele.market,
            ticker: ele.ticker,
            marketCode: ele.marketCode,
            search: ele.search,
            match: ele.match,
            lowHigh: ele.lowHigh,
          };

          if (ele.marketCode === currentMarketCode) {
            if (result === "Nothing") {
              returnValue = {
                market: ele.market,
                ticker: ele.ticker,
                marketCode: ele.marketCode,
                search: true,
                match: false,
                lowHigh: ele.lowHigh,
              };
            } else if (result === "Low") {
              returnValue = {
                market: ele.market,
                ticker: ele.ticker,
                marketCode: ele.marketCode,
                search: true,
                match: true,
                lowHigh: true,
              };
            } else if (result === "High") {
              returnValue = {
                market: ele.market,
                ticker: ele.ticker,
                marketCode: ele.marketCode,
                search: true,
                match: true,
                lowHigh: false,
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
      setProgressCounter((current: number) => current + 1);
    }
    console.log("run done");
  }
};
