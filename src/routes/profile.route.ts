import { Router } from "express";
import { updateProfile } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const router = Router();
router.put("/", authMiddleware, upload.single("photo"), updateProfile);
