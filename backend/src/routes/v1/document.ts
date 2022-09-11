import express from "express";
import passport from "passport";
import DocumentController from "../../controllers/document";
import optionalJWTAuthenicate from "../../middlewares/optional-jwt";
import isPremiumUser from "../../middlewares/premium-only";
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
  passport.authenticate("jwt", { session: false }),
  schemaValidate(CreateDocumentSchema),
  DocumentController.createDocument
);

router.get(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  DocumentController.getDocuments
);

router.get(
  `/:${DOCUMENT_ID_PARAM}`,
  passport.authenticate("jwt", { session: false }),
  schemaValidate(GetDocumentByIdSchema),
  DocumentController.getDocumentById
);

router.patch(
  `/save/:${DOCUMENT_ID_PARAM}`,
  passport.authenticate("jwt", { session: false }),
  schemaValidate(SaveDocumentSchema),
  DocumentController.saveDocument
);

router.post(
  `/share/:${DOCUMENT_ID_PARAM}`,
  passport.authenticate("jwt", { session: false }),
  isPremiumUser,
  schemaValidate(ShareDocumentSchema),
  DocumentController.shareDocument
);

router.post(
  `/view/:${DOCUMENT_ID_PARAM}`,
  optionalJWTAuthenicate,
  schemaValidate(CanViewDocumentSchema),
  DocumentController.canViewDocument
);

router.patch(
  `/unshare/:${DOCUMENT_ID_PARAM}`,
  passport.authenticate("jwt", { session: false }),
  schemaValidate(UnShareDocumentSchema),
  DocumentController.unShareDocument
);

export default router;
