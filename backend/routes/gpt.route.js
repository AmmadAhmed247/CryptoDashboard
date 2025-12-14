import express from "express"

import { getAllScoresForGpt } from "../controllers/Gpt.controller.js"
import {chatWithBoth} from "../controllers/chat.controller.js"
const router=express.Router()

router.get("/coin-score/:coinId",getAllScoresForGpt);
router.post("/chat", chatWithBoth);

export default router;