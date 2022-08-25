export type UserErrorCode =
  | "PAE000"
  | "PAE001"
  | "PAE002"
  | "PAE003"
  | "PAE004"
  | "PAE005"
  | "PAE006"
  | "PAE007"
  | "PAE008";

export const UNAUTHORIZED = "PAE000";
export const INVALID_EMAIL_ERROR = "PAE001";
export const INVALID_PASSWORD_ERROR = "PAE002";
export const INVALID_CONFIRM_ERROR = "PAE003";
export const USER_ALREADY_EXISTED = "PAE004";
export const USER_NOT_FOUND = "PAE005";
export const LOGIN_WRONG_PASSWORD = "PAE006";
export const CANNOT_CREATE_STRIPE_CUSTOMER = "PAE007";
export const NOT_PREMIUM_USER = "PAE008";
