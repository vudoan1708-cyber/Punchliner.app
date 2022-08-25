import type { Model } from "mongoose";

export enum AppUserTypeEnum {
  PREMIUM = "PREMIUM",
  NORMAL = "NORMAL",
}
interface IAccountDoc {
  type: AppUserTypeEnum;
  email: string;
  password: string;
  stripe_cus_id: string;
}

interface IAccountMethods {
  comparePassword(p: string): Promise<boolean>;
}

type AccountModel = Model<IAccountDoc, {}, IAccountMethods>;

export type { IAccountDoc, IAccountMethods, AccountModel };
