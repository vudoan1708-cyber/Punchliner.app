import type { ErrorCode } from ".";

const ERROR_EN: Record<ErrorCode, string> = {
  PAE000: "Unauthorized",
  PAE001: "Invalid email address",
  PAE002: "Invalid password",
  PAE003: "Invalid confirm password",
  PAE004: "User's already existed",
  PAE005: "User not found",
  PAE006: "Wrong password",
  PAE007: "Invalid document id",
  PAE008: "Title for a document is required",
  PAE009: "Invalid passcode (minimum 6 characters)",
  PAE010: "Document not found",
  PAE011: "Document is already shared",
};

export { ERROR_EN };