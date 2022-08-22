import type { Model } from "mongoose";

interface IAccountDoc {
  email: string;
  password: string;
  stripe_cus_id: string;
}

interface IAccountMethods {
  comparePassword(p: string): Promise<boolean>;
}

type AccountModel = Model<IAccountDoc, {}, IAccountMethods>;

export type { IAccountDoc, IAccountMethods, AccountModel };
