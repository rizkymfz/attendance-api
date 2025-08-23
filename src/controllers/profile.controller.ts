import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { publishToChannel } from "../services/rabbit.js";

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { phone, photo, password } = req.body;
        const user = await User.findByPk((req as any).user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        if (password) user.password = await bcrypt.hash(password, 10);
        if (phone) user.phone = phone;
        if (photo) user.photo = photo;
    
        if (req.file) {
          user.photo = `/uploads/${req.file.filename}`;
        }
    
        await user.save();

        // logger
        const logData = {
            user_id: user.id,
            action: "UPDATE_PROFILE",
            created_at: new Date(),
            details: {
                phone,
                photo: user.photo,
            },
        };
        publishToChannel("user_logs", logData);

        const userData = user.toJSON();
        delete userData.password;
        
        return successResponse(res, userData, "update profile success");
    } catch (err) {
        return errorResponse(res, "update profile failed", 500, err);
    }
};
