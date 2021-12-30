import express from "express";
import { run } from "./index";
import path from "path";

const home = async (req, res) => {
  run();
  res.send(
    express.static(path.join(__dirname, "../../client/build/index.html"))
  );
  return;
};

export default home;
