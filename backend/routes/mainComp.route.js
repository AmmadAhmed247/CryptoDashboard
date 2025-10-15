import express from "express";
import { calculateCI, calculateCQS,calculateRiskIndex,calculateTimingScore } from "../controllers/mainComponents.controller.js";

const router = express.Router();

router.post("/coinquality", calculateCQS);
router.post("/cointimingscore", calculateTimingScore);
router.post("/coinriskindex", calculateRiskIndex);
router.post("/coinci", calculateCI);

export default router;
