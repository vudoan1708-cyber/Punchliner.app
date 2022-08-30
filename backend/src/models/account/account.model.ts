import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { ACCOUNT_MODEL_NAME, SALT_WORK_FACTOR } from "./account.constant";
import {
  AccountModel as AccountModelType,
  AppUserTypeEnum,
  IAccountDoc,
  IAccountMethods,
} from "./account.type";

const AccountSchema = new Schema<
  IAccountDoc,
  AccountModelType,
  IAccountMethods
>(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    stripe_cus_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [AppUserTypeEnum.PREMIUM, AppUserTypeEnum.NORMAL],
      default: AppUserTypeEnum.NORMAL,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

AccountSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

AccountSchema.method(
  "comparePassword",
  async function comparePassword(p: string) {
    if (!this.password) return false;
    return await bcrypt.compare(p, this.password);
  }
);

const AccountModel = model(ACCOUNT_MODEL_NAME, AccountSchema);

export default AccountModel;
