import type { Request, Response, NextFunction } from "express";
import { DOCUMENT_VIEW_FORBIDDEN_WRONG_PASSCODE } from "../shared/error";
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

  const res = {
    success: false,
    message: ERROR_EN[error.code] || error.message,
    code: error.code,
    passcodeRequired: false,
  };

  // NOTE: handle special case(s)
  const isDocumentViewWrongPasscode =
    error?.code === DOCUMENT_VIEW_FORBIDDEN_WRONG_PASSCODE;

  if (isDocumentViewWrongPasscode) {
    res.passcodeRequired = true;
  }

  response.status(statusCode).send(res);
}
