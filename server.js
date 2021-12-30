import express from "express";
import { run } from "./index.js";

const app = express();
const port = 3030;

app.get("/", (req, res) => {
  run();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
