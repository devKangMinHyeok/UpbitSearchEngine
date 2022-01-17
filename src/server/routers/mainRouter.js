import express from "express";
import { home } from "../controllers/home";

const mainRouter = express.Router();
mainRouter.get("*", home);
export default mainRouter;
