import type { Request, Response } from "express";
import { Attendance } from "../models/Attendance.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from "sequelize";
import { User } from "../models/User.js";

export const clockIn = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const today = new Date();
        console.log(today)
        const dateStr = today.toISOString().slice(0, 10);

        const exist = await Attendance.findOne({
            where: {
                user_id: userId,
                clock_in: {
                [Op.gte]: new Date(`${dateStr} 00:00:00`),
                [Op.lte]: new Date(`${dateStr} 23:59:59`),
                },
            },
        });

        if (exist) {
            return errorResponse(res, "already clock in today", 400);
        }

        const attendance = await Attendance.create({
            user_id: userId,
            clock_in: new Date(),
            status: "in",
        });

        return successResponse(res, attendance, "clock in success");
    } catch (err) {
        return errorResponse(res, "clock in failed", 500, err);
    }
};

export const clockOut = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10);

        const attendance = await Attendance.findOne({
            where: {
                user_id: userId,
                clock_in: {
                [Op.gte]: new Date(`${dateStr} 00:00:00`),
                [Op.lte]: new Date(`${dateStr} 23:59:59`),
                },
            },
        });

        if (!attendance) {
            return errorResponse(res, "you haven't clock in today", 400);
        }

        if (attendance.clock_out) {
            return errorResponse(res, "already clock out today", 400);
        }

        attendance.clock_out = new Date();
        attendance.status = "out";
        await attendance.save();

        return successResponse(res, attendance, "clock out success");
    } catch (err) {
        return errorResponse(res, "clock out failed", 500, err);
    }
};

export const list = async (req: Request, res: Response) => {
    //lanjut besok
    const { from, to } = req.query;
    const userId = (req as any).user.id;

    let whereCondition: any = {
         user_id: userId,
    };
    
    if (from && to) {
        const startDate = new Date(from as string);
        const endDate = new Date(to as string);
        endDate.setHours(23, 59, 59, 999);

        whereCondition.createdAt = {
            [Op.between]: [startDate, endDate]
        };
    } else {
        const today = new Date();
        const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startMonth.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        whereCondition.createdAt = {
            [Op.between]: [startMonth, endOfToday]
        };
    }

    const data = await Attendance.findAll({
        include: {
            model: User,
            as: 'user'
        },
        where: whereCondition,
        order: [["created_at", "desc"]]
    });
    
    return successResponse(res, data);
}