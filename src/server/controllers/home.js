import express from "express";
import { run } from "./index";
import path from "path";

export const home = async (req, res) => {
  try {
    console.log("home");
    // await run();
    // console.log("here2");

    return res
      .status(200)
      .sendFile(path.join(__dirname, "../../client/build/index.html"));
  } catch (e) {
    console.log(e);
  }
};
