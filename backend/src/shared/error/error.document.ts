export type DocumentErrorCode =
  | "PAE007"
  | "PAE008"
  | "PAE009"
  | "PAE010"
  | "PAE011";

export const SAVE_DOCUMENT_INVALID_DOCUMENT_ID = "PAE007";
export const CREATE_DOCUMENT_INVALID_TITLE = "PAE008";
export const SHARE_DOCUMENT_INVALID_PASSCODE = "PAE009";
export const DOCUMENT_NOT_FOUND = "PAE010";
export const DOCUMENT_ALREADY_SHARED = "PAE011";
