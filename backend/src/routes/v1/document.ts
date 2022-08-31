import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import configs from "../../configs";
import DocumentController from "../../controllers/document";
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
  (req, res, next) => {
    // invalid token - synchronous
    try {
      const bearer = req.headers["authorization"]?.split("Bearer ")?.[1];
      if (bearer) {
        const decoded = jwt.verify(bearer, configs.JWT_SECRET);
        if (typeof decoded !== "string") {
          req.user = { ...(decoded as Express.User) };
        }
      }
    } catch (err) {
      // err
      console.log("err:", err);
    } finally {
      next();
    }
  },
  // passport.authenticate("jwt", { session: false }),
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
