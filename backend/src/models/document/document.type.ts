import type { Model, Types } from "mongoose";

interface IDocumentDoc {
  title: string;
  words: number;
  content?: string;
  passcode?: string;
  isShared: boolean;
  ownerId: Types.ObjectId;
}

interface IDocumentMethods {
  comparePasscode(p: string): Promise<boolean>;
}

type DocumentModelType = Model<IDocumentDoc, {}, IDocumentMethods>;

export type { IDocumentDoc, IDocumentMethods, DocumentModelType };
