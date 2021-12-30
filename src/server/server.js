import express from "express";
import rootRouter from "./routers/rootRouter.js";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/", rootRouter);

export default app;
