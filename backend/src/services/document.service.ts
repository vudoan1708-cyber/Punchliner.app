import PasswordUtil from "../utils/password";
import Supabase from "../vendor/supabase";
import type { definitions } from "../types/supabase";

type NullableDocumentResponse = definitions["document"] | null;

async function canUserViewDocument(
  document: NullableDocumentResponse,
  userId?: string,
  inputPasscode?: string
): Promise<NullableDocumentResponse> {
  try {
    if (!document) return null;
    // NOTE: check if user is owner, if yes -> return
    if (document.ownerId.toString() === userId) return document;
    if (!document.isShared) return null;
    // NOTE: if not, then check the passcode
    if (!inputPasscode) return null;
    const isValidPasscode = await PasswordUtil.isPasswordMatch(
      inputPasscode,
      document.passcode ?? ""
    );
    if (!isValidPasscode) return null;
    // NOTE: if passcode correct -> return
    return document;
  } catch (error) {
    throw error;
  }
}

async function getAllUserDocuments(
  userId: string,
  pagination?: { offset: number; pageSize?: number }
): Promise<Array<definitions["document"]> | null> {
  return await Supabase.findAllDocumentsByOwnerId(userId, pagination);
}

async function getDocumentById(
  documentId: string
): Promise<definitions["document"] | null> {
  return await Supabase.getDocumentById(documentId);
}

async function createDocument(
  values: Partial<definitions["document"]>
): Promise<definitions["document"] | null> {
  if (values.passcode) {
    values.passcode = await PasswordUtil.hashPassword(values.passcode);
  }
  return await Supabase.createDocument(values);
}

async function updateDocument(
  values: Partial<definitions["document"]>,
  newPasscode?: string
): Promise<definitions["document"] | null> {
  if (newPasscode) {
    values.passcode = await PasswordUtil.hashPassword(newPasscode);
  }
  return await Supabase.updateDocument(values);
}

export default {
  canUserViewDocument,
  getAllUserDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
};
