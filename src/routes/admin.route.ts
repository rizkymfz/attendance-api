import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createUser, getAttendanceList, getUserById, getUserList, updateUser } from "../controllers/admin.controller.js";
import { upload } from "../middleware/upload.js";

export const router = Router();

router.get("/attendance", authMiddleware, getAttendanceList);
router.get("/user", authMiddleware, getUserList);
router.get("/user/:userId", authMiddleware, getUserById);
router.post("/user", authMiddleware, upload.single("photo"), createUser);
router.put("/user/:userId", authMiddleware, upload.single("photo"), updateUser);