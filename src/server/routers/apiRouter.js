import express from "express";
import { home, test } from "../controllers/home";

const apiRouter = express.Router();

apiRouter.get("/home", home);
apiRouter.get("/test", test);

export default apiRouter;
