import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.scope("withPassword").findOne({ where: { email } });
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return errorResponse(res, "Invalid credentials", 400);
        } 

        const token = generateToken({ id: user.id, email: user.email });
        return successResponse(res, { token }, "Login success");
    } catch (err) {
        return errorResponse(res, "Login error", 500, err);
    }
};

export const me = async (req: Request, res: Response) => {
    const user = await User.findByPk((req as any).user.id);
    return successResponse(res, user);
};
