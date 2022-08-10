import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

export function errorHandler(
  error: ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.header("Content-Type", "application/json");

  const statusCode = error.statusCode || 400;

  response.status(statusCode).send({
    success: false,
    message: error.message,
    code: error.code,
  });
}
