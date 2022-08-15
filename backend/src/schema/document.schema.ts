import z from "zod";
import {
  CREATE_DOCUMENT_INVALID_TITLE,
  DOCUMENT_CONTENT_REQUIRED,
  SAVE_DOCUMENT_INVALID_DOCUMENT_ID,
  SHARE_DOCUMENT_INVALID_PASSCODE,
} from "../shared/error";

const SaveDocumentSchema = z.object({
  params: z
    .object({
      documentId: z.string().min(1, SAVE_DOCUMENT_INVALID_DOCUMENT_ID),
    })
    .refine((data) => data.documentId !== ":documentId", {
      message: SAVE_DOCUMENT_INVALID_DOCUMENT_ID,
      path: ["documentId"],
    }),
  body: z.object({
    content: z.string().min(6, DOCUMENT_CONTENT_REQUIRED),
    title: z.string().min(6, CREATE_DOCUMENT_INVALID_TITLE),
  }),
});

const CreateDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(6, CREATE_DOCUMENT_INVALID_TITLE),
    content: z.string().optional(),
  }),
});

const GetDocumentByIdSchema = z.object({
  params: z
    .object({
      documentId: z.string().min(1, SAVE_DOCUMENT_INVALID_DOCUMENT_ID),
    })
    .refine((data) => data.documentId !== ":documentId", {
      message: SAVE_DOCUMENT_INVALID_DOCUMENT_ID,
      path: ["documentId"],
    }),
  query: z.object({
    passcode: z.string().optional(),
  }),
});

const ShareDocumentSchema = z.object({
  params: z
    .object({
      documentId: z.string().min(1, SAVE_DOCUMENT_INVALID_DOCUMENT_ID),
    })
    .refine((data) => data.documentId !== ":documentId", {
      message: SAVE_DOCUMENT_INVALID_DOCUMENT_ID,
      path: ["documentId"],
    }),
  body: z.object({
    passcode: z.string().min(6, SHARE_DOCUMENT_INVALID_PASSCODE),
  }),
});

export {
  SaveDocumentSchema,
  CreateDocumentSchema,
  GetDocumentByIdSchema,
  ShareDocumentSchema,
};
