class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  code: string;

  constructor(
    statusCode: number,
    code: string,
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
