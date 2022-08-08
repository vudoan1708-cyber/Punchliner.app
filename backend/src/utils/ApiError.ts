import type { HttpStatus } from "http-status";

class ApiError extends Error {
  statusCode: HttpStatus;
  isOperational: boolean;

  constructor(
    statusCode: HttpStatus,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
