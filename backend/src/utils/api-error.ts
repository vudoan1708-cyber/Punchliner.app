import { ErrorCode } from "../shared/error";

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  code: ErrorCode;

  constructor(
    statusCode: number,
    code: ErrorCode,
    isOperational = true,
    stack = ""
  ) {
    super(code);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
