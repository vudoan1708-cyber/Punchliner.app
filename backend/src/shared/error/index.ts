import type { DocumentErrorCode } from "./error.document";
import type { UserErrorCode } from "./error.user";

export * from "./error.user";
export * from "./error.document";

export type ErrorCode = UserErrorCode | DocumentErrorCode;
