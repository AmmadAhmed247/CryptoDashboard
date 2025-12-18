import express from "express";
import { systemeWebhook } from "../controllers/webhook.controller.js";
import { premiumOnly } from "../middlewares/premium.js";
const router = express.Router();

router.post("/systeme",premiumOnly, systemeWebhook);

export default router;
