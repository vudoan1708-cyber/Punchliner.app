interface AppResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export function createResponse<T = any>(
  data: T,
  isSuccess = true,
  msg?: string
): AppResponse<T> {
  return {
    success: isSuccess,
    message: msg,
    data,
  };
}
