import type { Request, Response } from "express";
import { Attendance } from "../models/Attendance.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from "sequelize";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const getAttendanceList = async (req: Request, res: Response) => {
    try {
        const { from, to } = req.query;

        let whereCondition: any = {};
        
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
            where: whereCondition,
            order: [["created_at", "desc"]],
            include: {
                model: User,
                as: 'user'
            },
        });
        
        return successResponse(res, data);
    } catch (err) {
        return errorResponse(res, "failed to fetch data", 500, err);
    }
}

export const getUserList = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        let whereCondition: any = {}

        if (search) {
            whereCondition.name = {
                [Op.like]: `%${search}%`
            };
        }

        const data = await User.findAll({
            where: whereCondition,
            order: [["id", "desc"]]
        })

        return successResponse(res, data);
    } catch (err) {
        return errorResponse(res, "failed to fetch data", 500, err);
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        return successResponse(res, user);
    } catch (err) {
        return errorResponse(res, "failed to fetch data", 500, err);
    }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email, and password are required", 400);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return errorResponse(res, "Eamil already exist", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      photo: photoPath,
    });

    const userData = newUser.toJSON();
    delete userData.password;

    return successResponse(res, userData, "create user success");
  } catch (err) {
    return errorResponse(res, "create user failed", 500, err);
  }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { phone, photo, password, name, email } = req.body;
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) return errorResponse(res, "user not found", 404);

        const existing = await User.findOne({
            where: {
                email,
                id: { [Op.ne]: userId },
            },
        });
        if (existing) {
            return errorResponse(res, "Eamil already exist", 400);
        }
    
        if (password) user.password = await bcrypt.hash(password, 10);
        if (phone) user.phone = phone;
        if (photo) user.photo = photo;
    
        if (req.file) {
            user.photo = `/uploads/${req.file.filename}`;
        }
    
        user.name = name;
        user.email = email;
        await user.save();

        const userData = user.toJSON();
        delete userData.password;
        
        return successResponse(res, userData, "update user success");
    } catch (err) {
        return errorResponse(res, "update user failed", 500, err);
    }
}

