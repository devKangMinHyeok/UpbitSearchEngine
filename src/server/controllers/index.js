import fetch from "node-fetch";

const sleep = (ms) => {
  // console.log("sleeping...");
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const waitApiRemain = (response) => {
  const remainString = response.headers.get("remaining-req");
  if (remainString === null) {
    return 0;
  }
  let words = remainString.split(";");
  words = words.map((word) => word.trim());
  const min = words[1].split("=");
  const sec = words[2].split("=");
  const remainMin = Number(min[1]);
  const remainSec = Number(sec[1]);

  if (remainSec === 0) {
    // console.log(`No remaining api request limit!!`);
    return 1000;
  }
  if (remainMin === 0) {
    // console.log(`No remaining api request limit!!`);
    return 60000;
  }
  return 0;
};

const getMarketCodes = async () => {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const response = await fetch(
    `https://api.upbit.com/v1/market/all?isDetails=false`,
    options
  );
  const json = await response.json(response);

  return json;
};

const fetchDayCandle = async (market) => {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const response = await fetch(
    `https://api.upbit.com/v1/candles/minutes/240?market=${market}&count=20`,
    options
  );
  const sleepTime = waitApiRemain(response);

  if (sleepTime !== 0) {
    await sleep(sleepTime);
  }

  const json = await response.json(response);

  return json;
};

const getMovingAverage = (data, day) => {
  let sum = 0;
  let avr = 0;
  data.forEach((e) => {
    sum += e.trade_price;
  });
  avr = sum / day;
  // console.log(`Moving average for ${day}day: `, avr);
  return avr;
};

const getEnvelope = (avr, prt) => {
  const envelopeHigh = avr * (100 + prt) * 0.01;
  const envelopeLow = avr * (100 - prt) * 0.01;
  // console.log("envelopeHigh: ", envelopeHigh);
  // console.log("envelopeLow: ", envelopeLow);

  return { EH: envelopeHigh, EL: envelopeLow };
};

const checkEnvelope = (candle, eHigh, eLow) => {
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

export const run = async () => {
  const marketCodes = await getMarketCodes();
  for (let i = 0; i < marketCodes.length; i++) {
    // console.log(`${marketCodes[i].market} Analysis...`);

    const data = await fetchDayCandle(marketCodes[i].market);
    const MA = getMovingAverage(data, 20);
    const { EH, EL } = getEnvelope(MA, 10);

    const currentCandle = data[0];

    const result = checkEnvelope(currentCandle, EH, EL);
    if (result === "Low") {
      console.log("Envelope Low: ", marketCodes[i].market);
    }
    // console.log("----------------------------------");
  }
  console.log("run done");
};
