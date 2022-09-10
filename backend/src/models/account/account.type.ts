import type { Model } from "mongoose";
import { definitions } from "../../types/supabase";

export enum AppUserTypeEnum {
  PREMIUM = "PREMIUM",
  NORMAL = "NORMAL",
}

type A = Pick<definitions, "account">["account"];
interface IAccountDoc extends A {
  // type: AppUserTypeEnum;
}

interface IAccountMethods {
  comparePassword(p: string): Promise<boolean>;
}

type AccountModel = Model<IAccountDoc, {}, IAccountMethods>;

export type { IAccountDoc, IAccountMethods, AccountModel };
