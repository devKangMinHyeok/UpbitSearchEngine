const DEFAULT_URL = "https://api.upbit.com";

export async function fetchMarketCodes() {
  const options = { method: "GET", headers: { Accept: "application/json" } };
  const response = await fetch(`/v1/market/all?isDetails=false`, options);
  const json = await response.json();

  return json;
}

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

export async function fetchCandle(url: string) {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const response = await fetch(url, options);
  const sleepTime = waitApiRemain(response);

  if (sleepTime !== 0) {
    await sleep(sleepTime);
  }

  const json = await response.json();

  return json;
}
