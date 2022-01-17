import fetch from "node-fetch";

const sleep = (ms) => {
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
    return 600;
  }
  if (remainMin === 0) {
    return 60000;
  }
  return 0;
};

export const apiController = async (req, res) => {
  const DEFAULT_URL = "https://api.upbit.com";
  const options = { method: "GET", headers: { Accept: "application/json" } };
  try {
    const response = await fetch(`${DEFAULT_URL}${req.originalUrl}`, options);
    const sleepTime = waitApiRemain(response);

    if (sleepTime !== 0) {
      await sleep(sleepTime);
    }

    const json = await response.json();
    return res.json(json);
  } catch (e) {
    console.log(e);
  }
};
