import express from "express";
import mainRouter from "./routers/mainRouter.js";
import path from "path";

import morgan from "morgan";
import moment from "moment-timezone";
import apiRouter from "./routers/apiRouter.js";

const customServerLogger = (timezone) => {
  morgan.token("date", (req, res, tz) => {
    return moment().tz(tz).format();
  });

  morgan.format(
    "myformat",
    `[:date[${timezone}]] ":method :url" :status :res[content-length] - :response-time ms`
  );

  const logger = morgan("myformat");
  return logger;
};

const app = express();
const logger = customServerLogger(process.env.MY_TIME_ZONE);

app.use(express.static(path.join(__dirname, "../client/build")));

app.use(logger);
app.use("/v1", apiRouter);
// app.use("/", mainRouter);

export default app;
