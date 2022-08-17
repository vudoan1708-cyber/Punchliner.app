import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { ACCOUNT_MODEL_NAME, SALT_WORK_FACTOR } from "../account";
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
    passcode: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: ACCOUNT_MODEL_NAME,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

DocumentSchema.pre("save", function (next) {
  const document = this;

  if (!document.isModified("passcode")) return next();

  const passcode = document.passcode;

  if (!passcode) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(passcode, salt, function (err, hash) {
      if (err) return next(err);

      document.passcode = hash;

      next();
    });
  });
});

DocumentSchema.method(
  "comparePasscode",
  async function comparePasscode(p: string) {
    return await bcrypt.compare(p, this.passcode);
  }
);

const DocumentModel = model(DOCUMENT_MODEL_NAME, DocumentSchema);

export default DocumentModel;
