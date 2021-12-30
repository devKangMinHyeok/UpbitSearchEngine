import express from "express";
import home from "../controllers/home";

const rootRouter = express.Router();

rootRouter.get("/", home);

export default rootRouter;
