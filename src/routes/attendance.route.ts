import { Router } from "express";
import { clockIn, clockOut, list } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const router = Router();

router.get("/", authMiddleware, list);
router.post("/clockin", authMiddleware, clockIn);
router.post("/clockout", authMiddleware, clockOut);