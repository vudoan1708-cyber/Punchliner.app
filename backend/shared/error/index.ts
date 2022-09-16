import type { DocumentErrorCode } from "./error.document";
import { PaymentErrorCode } from "./error.payment";
import type { UserErrorCode } from "./error.user";

export * from "./error.user";
export * from "./error.document";

export type ErrorCode = UserErrorCode | DocumentErrorCode | PaymentErrorCode;
