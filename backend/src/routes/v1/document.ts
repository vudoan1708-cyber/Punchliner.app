import express from "express";
import DocumentController from "../../controllers/document";
import { schemaValidate } from "../../middlewares/schema-validator";
import {
  SaveDocumentSchema,
  CreateDocumentSchema,
  GetDocumentByIdSchema,
  ShareDocumentSchema,
} from "../../schema/document.schema";

const router = express.Router();

const DOCUMENT_ID_PARAM = "documentId";

router.get("/overview", DocumentController.getDocuments);

router.get(
  `/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(GetDocumentByIdSchema),
  DocumentController.getDocumentById
);

router.post(
  "/",
  schemaValidate(CreateDocumentSchema),
  DocumentController.createDocument
);

router.patch(
  `/save/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(SaveDocumentSchema),
  DocumentController.saveDocument
);

router.post(
  `/share/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(ShareDocumentSchema),
  DocumentController.shareDocument
);

export default router;
