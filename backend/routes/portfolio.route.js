import express from "express";
import { getPortfolio, addCoin, removeCoin } from "../controllers/portfolio.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPortfolio);
router.post("/add", authMiddleware, addCoin);
router.delete("/remove/:coinId", authMiddleware, removeCoin);

export default router;
