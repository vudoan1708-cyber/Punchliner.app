import z from "zod";
import {
  CREATE_DOCUMENT_INVALID_TITLE,
  SAVE_DOCUMENT_INVALID_DOCUMENT_ID,
} from "../shared/error-codes";

const SaveDocumentSchema = z.object({
  params: z.object({
    documentId: z.string().min(1, SAVE_DOCUMENT_INVALID_DOCUMENT_ID),
  }),
  body: z.object({
    content: z.string().optional(),
  }),
});

const CreateDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(6, CREATE_DOCUMENT_INVALID_TITLE),
    content: z.string().optional(),
  }),
});

const GetDocumentByIdSchema = z.object({
  params: z.object({
    documentId: z.string().min(1, SAVE_DOCUMENT_INVALID_DOCUMENT_ID),
  }),
});

export { SaveDocumentSchema, CreateDocumentSchema, GetDocumentByIdSchema };
