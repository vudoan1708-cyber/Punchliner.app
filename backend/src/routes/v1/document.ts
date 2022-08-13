import express from "express";
import DocumentController from "../../controllers/document";
import { schemaValidate } from "../../middlewares/schema-validator";
import {
  SaveDocumentSchema,
  CreateDocumentSchema,
  GetDocumentByIdSchema,
} from "../../schema/document.schema";

const router = express.Router();

router.get("/overview", DocumentController.getDocuments);

router.get(
  "/:documentId",
  schemaValidate(GetDocumentByIdSchema),
  DocumentController.getDocumentById
);

router.post(
  "/",
  schemaValidate(CreateDocumentSchema),
  DocumentController.createDocument
);

router.patch(
  "/save/:documentId",
  schemaValidate(SaveDocumentSchema),
  DocumentController.saveDocument
);

export default router;
