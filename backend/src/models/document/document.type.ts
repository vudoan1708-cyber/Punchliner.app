import type { Model, Types } from "mongoose";

interface IDocumentDoc {
  title: string;
  words: number;
  content?: string;
  isShared: boolean;
  ownerId: Types.ObjectId;
}

interface IDocumentMethods {}

type DocumentModelType = Model<IDocumentDoc, {}, IDocumentMethods>;

export type { IDocumentDoc, IDocumentMethods, DocumentModelType };
