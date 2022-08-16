import type { Request, Response, NextFunction } from "express";
import { ERROR_EN } from "../shared/error/locale.en";
import ApiError from "../utils/api-error";

export function errorHandler(
  error: ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.header("Content-Type", "application/json");

  const statusCode = error.statusCode ?? 400;

  response.status(statusCode).send({
    success: false,
    message: ERROR_EN[error.code] || error.message,
    code: error.code,
  });
}
