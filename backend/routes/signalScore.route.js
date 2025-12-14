
import express from "express";
import { calculateAndUpdateScore } from "../controllers/Signalscore.controller.js";

const router = express.Router();

router.post("/score/:coinId", calculateAndUpdateScore);

export default router;
