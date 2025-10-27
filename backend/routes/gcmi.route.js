// routes/gcmi.routes.js
import express from "express";
import { getGCMI, triggerUpdate } from "../controllers/GcmiFactor.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limit for public endpoint
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // More generous since it's reading from DB
  message: "Too many requests, please try again later.",
});

// Public endpoint - get GCMI data
router.get("/gcmi", apiLimiter, getGCMI);

// Admin endpoint - manually trigger update (optional, protect with auth)
router.post("/gcmi/update", triggerUpdate);

export default router;