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

async function getByEmail(
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

async function getById(id: string): Promise<definitions["account"] | null> {
  const { data, error } = await supabase
    .from<definitions["account"]>("account")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    logger.error("supabase:", error);
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

export default {
  getById,
  getByEmail,
  getAllAccounts,
  createNewAccount,
};
