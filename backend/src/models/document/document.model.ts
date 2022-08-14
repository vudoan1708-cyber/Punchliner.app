import { Schema, model } from "mongoose";
import { ACCOUNT_MODEL_NAME } from "../account";
import { DOCUMENT_MODEL_NAME } from "./document.constant";
import {
  DocumentModelType,
  IDocumentDoc,
  IDocumentMethods,
} from "./document.type";

const DocumentSchema = new Schema<
  IDocumentDoc,
  DocumentModelType,
  IDocumentMethods
>(
  {
    title: {
      type: String,
      required: true,
    },
    words: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      default: "<div></div>",
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: ACCOUNT_MODEL_NAME,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const DocumentModel = model(DOCUMENT_MODEL_NAME, DocumentSchema);

export default DocumentModel;
