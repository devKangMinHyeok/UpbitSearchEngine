import express from "express";
import apiRouter from "./routers/apiRouter.js";
import path from "path";

import morgan from "morgan";
import moment from "moment-timezone";

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

app.use("/", express.static(path.join(__dirname, "../client/build")));

app.use(logger);
app.use("/api", apiRouter);

export default app;
