// routes/gcmi.route.js
import express from "express";
import { getGCMI } from "../controllers/GcmiFactor.controller.js";

const router = express.Router();

router.get("/gcmi", getGCMI);

export default router;
