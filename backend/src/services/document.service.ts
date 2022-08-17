import { load } from "cheerio";
import { Document, Types } from "mongoose";
import { IDocumentDoc, IDocumentMethods } from "../models/document";

type NullableDocumentResponse =
  | (Document<unknown, any, IDocumentDoc> &
      IDocumentDoc & {
        _id: Types.ObjectId;
      } & IDocumentMethods)
  | null;

function countContentWords(content?: string): number {
  try {
    if (!content) return 1;
    // const refinedContent = content?.replaceAll(/\\/g, "");
    const $ = load(content);
    const innerText = $.text()?.replaceAll(/\s/g, "");
    return innerText?.length ?? 1;
  } catch (e) {
    console.error("count word error:", e);
    return content?.length ?? 1;
  }
}

async function canUserViewDocument(
  document: NullableDocumentResponse,
  userId: string,
  passcode?: string
): Promise<NullableDocumentResponse> {
  try {
    if (!document) return null;
    // NOTE: check if user is owner, if yes -> return
    if (document.ownerId.toString() === userId) return document;
    if (!document.isShared) return null;
    // NOTE: if not, then check the passcode
    if (!passcode) return null;
    const isValidPasscode = await document.comparePasscode(passcode);
    if (!isValidPasscode) return null;
    // NOTE: if passcode correct -> return
    return document;
  } catch (error) {
    throw error;
  }
}

export default { countContentWords, canUserViewDocument };
