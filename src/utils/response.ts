// src/utils/response.ts
import { type Response } from "express";

export const successResponse = (
  res: Response,
  data: any = null,
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = "Error",
  status = 500,
  error: any = null
) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
