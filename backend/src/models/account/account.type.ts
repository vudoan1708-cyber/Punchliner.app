import type { Model } from "mongoose";

interface IAccountDoc {
  email: string;
  password: string;
}

interface IAccountMethods {
  comparePassword(p: string): Promise<boolean>;
}

type AccountModel = Model<IAccountDoc, {}, IAccountMethods>;

export type { IAccountDoc, IAccountMethods, AccountModel };
