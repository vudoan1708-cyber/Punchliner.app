import { createClient } from "@supabase/supabase-js";
import { definitions } from "../types/supabase";
import configs from "../configs";
import logger from "../configs/logger";

const supabase = createClient(
  configs.SUPABASE.PROJECT_URL,
  configs.SUPABASE.API_KEY
);

async function getAllAccounts(): Promise<Array<definitions["account"]> | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .select("*");
  if (error) {
    logger.error("supabase-get-all-accounts:", error);
    return null;
  }
  return data;
}

async function getAccountByEmail(
  email: string
): Promise<definitions["account"] | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    logger.error("supabase-get-by-email:", error);
    return null;
  }
  return data;
}

async function getAccountById(
  id: string
): Promise<definitions["account"] | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    logger.error("supabase-get-by-id:", error);
    return null;
  }
  return data;
}

async function getAccountByStripeCustomerId(
  stripe_cus_id: string
): Promise<definitions["account"] | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .select("*")
    .eq("stripe_cus_id", stripe_cus_id)
    .single();
  if (error) {
    logger.error("supabase-get-by-stripe-customer-id:", error);
    return null;
  }
  return data;
}

async function createNewAccount(
  payload: Partial<definitions["account"]>
): Promise<definitions["account"] | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .insert(payload)
    .single();
  if (error) {
    logger.error("supabase-create-new-account:", error);
    return null;
  }
  return data;
}

async function updateAccount(
  payload: Partial<definitions["account"]>
): Promise<definitions["account"] | null> {
  console.log(payload);
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .update(payload)
    .single();

  if (error) {
    console.log("err:", error);
    logger.error("supabase-update-account:", error);
    return null;
  }
  return data;
}

async function findAllDocumentsByOwnerId(
  ownerId: string,
  pagination?: { offset: number; pageSize?: number }
): Promise<Array<definitions["document"]> | null> {
  const queryBuilder = supabase
    .from<definitions["document"]>("document")
    .select("*")
    .eq("ownerId", ownerId);

  if (pagination) {
    const { offset, pageSize = 10 } = pagination;
    queryBuilder.range(offset, offset + pageSize).limit(pageSize);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    logger.error("supabase-find-all-documents-by-id:", error);
    return null;
  }
  return data;
}

async function getDocumentById(
  id: string
): Promise<definitions["document"] | null> {
  const { data, error } = await supabase
    .from<definitions["document"]>("document")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    logger.error("supabase-get-document-by-id:", error);
    return null;
  }
  return data;
}

async function createDocument(
  payload: Partial<definitions["document"]>
): Promise<definitions["document"] | null> {
  const { data, error } = await supabase
    .from<definitions["document"]>("document")
    .insert(payload)
    .single();

  if (error) {
    logger.error("supabase-create-document:", error);
    return null;
  }

  return data;
}

async function updateDocument(
  payload: Partial<definitions["document"]>
): Promise<definitions["document"] | null> {
  const { data, error } = await supabase
    .from<definitions["document"]>("document")
    .update(payload)
    .single();

  if (error) {
    logger.error("supabase-update-document:", error);
    return null;
  }

  return data;
}

export default {
  // Accounts
  updateAccount,
  getAccountById,
  getAllAccounts,
  createNewAccount,
  getAccountByEmail,
  getAccountByStripeCustomerId,

  // Documents
  createDocument,
  updateDocument,
  getDocumentById,
  findAllDocumentsByOwnerId,
};
