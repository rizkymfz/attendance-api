import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, me);
