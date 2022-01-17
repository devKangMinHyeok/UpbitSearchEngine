import express from "express";
import { apiController } from "../controllers/apiController";

const apiRouter = express.Router();
apiRouter.get("*", apiController);
export default apiRouter;
