import type { Model } from "mongoose";
import { Schema, model } from "mongoose";

interface IAccountDoc {
  email: string;
  password: string;
  created_at: string;
  udpated_at: string;
}

interface IAccountModel extends Model<IAccountDoc> {}

const AccountSchema = new Schema<IAccountDoc, IAccountModel>();

const AccountModel = model("Account", AccountSchema);

export default AccountModel;
