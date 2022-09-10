import supabase from "../vendor/supabase";
import PasswordUtil from "../utils/password";
import type { definitions } from "../types/supabase";

async function findAllAccounts(): Promise<Array<
  definitions["account"]
> | null> {
  const accounts = await supabase.getAllAccounts();
  return accounts;
}

async function findAccountByEmail(
  email: string
): Promise<definitions["account"] | null> {
  return await supabase.getByEmail(email);
}

async function createNewAccount(
  payload: Partial<definitions["account"]>
): Promise<definitions["account"] | null> {
  // hash the password
  if (payload.password) {
    payload.password = await PasswordUtil.hashPassword(payload.password);
  }
  return await supabase.createNewAccount(payload);
}

export default { findAllAccounts, findAccountByEmail, createNewAccount };
