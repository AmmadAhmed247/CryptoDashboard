import express from "express"
import { forgotPassword, getCurrentUser, login,logout,register, resetPassword } from "../controllers/auth.controller.js";
import { authMiddleware  } from "../middlewares/authMiddleware.js";
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me",authMiddleware,getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;