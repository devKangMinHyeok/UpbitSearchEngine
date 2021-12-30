import express from "express";
import rootRouter from "./routers/rootRouter.js";

const app = express();

app.use("/", rootRouter);

export default app;
