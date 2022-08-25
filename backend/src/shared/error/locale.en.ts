import type { ErrorCode } from ".";

const ERROR_EN: Record<ErrorCode, string> = {
  PAE000: "Unauthorized",
  PAE001: "Invalid email address",
  PAE002: "Invalid password",
  PAE003: "Invalid confirm password",
  PAE004: "User's already existed",
  PAE005: "User not found",
  PAE006: "Wrong password",
  PAE007: "Cannot register with this email",
  PAE008:
    "You are using a free account. Please upgrade your account for more premium features",
  PAE100: "Invalid document id",
  PAE101: "Title for a document is required",
  PAE102: "Invalid passcode (minimum 6 characters)",
  PAE103: "Document not found",
  PAE104: "Document is already shared",
  PAE105: "Document's content is required",
  PAE106: "You cannot view this document",
  PAE107: "Wrong document's passcode",
  PAE108: "Cannot unshare (Wrong document's passcode)",
};

export { ERROR_EN };
