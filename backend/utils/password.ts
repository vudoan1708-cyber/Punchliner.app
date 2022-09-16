import bcrypt from "bcrypt";

async function isPasswordMatch(
  inputPassword: string,
  realPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, realPassword);
}

async function hashPassword(raw: string): Promise<string> {
  return await bcrypt.hash(raw, 10);
}

export default {
  isPasswordMatch,
  hashPassword,
};
