import express from "express";
import DocumentController from "../../controllers/document";
import { schemaValidate } from "../../middlewares/schema-validator";
import {
  SaveDocumentSchema,
  CreateDocumentSchema,
  GetDocumentByIdSchema,
  ShareDocumentSchema,
  CanViewDocumentSchema,
  UnShareDocumentSchema,
} from "../../schema/document.schema";

const router = express.Router();

export const DOCUMENT_ID_PARAM = "documentId";

router.post(
  "/",
  schemaValidate(CreateDocumentSchema),
  DocumentController.createDocument
);

router.get("/overview", DocumentController.getDocuments);

router.get(
  `/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(GetDocumentByIdSchema),
  DocumentController.getDocumentById
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

router.post(
  `/view/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(CanViewDocumentSchema),
  DocumentController.canViewDocument
);

router.patch(
  `/unshare/:${DOCUMENT_ID_PARAM}`,
  schemaValidate(UnShareDocumentSchema),
  DocumentController.unShareDocument
);

export default router;
