import { PaginationOption } from "../shared/request-type";

interface AppResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Partial<PaginationOption>;
}

export function createResponse<T = any>(
  data: T,
  isSuccess = true,
  msg?: string,
  pagination?: Partial<PaginationOption>
): AppResponse<T> {
  return {
    success: isSuccess,
    message: msg,
    data,
    pagination,
  };
}
