import express from "express"
import { getCurrentUser, login,logout,register } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me",verifyToken,getCurrentUser);

export default router;