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
  PAE012: "Document's content is required",
  PAE013: "You cannot view this document",
  PAE014: "Wrong document's passcode",
  PAE015: "Cannot unshare (Wrong document's passcode)",
};

export { ERROR_EN };
