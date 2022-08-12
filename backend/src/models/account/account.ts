import type { Model } from "mongoose";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;
interface IAccountDoc {
  email: string;
  password: string;
}

interface IAccountMethods {
  comparePassword(p: string): Promise<boolean>;
}

type AccountModel = Model<IAccountDoc, {}, IAccountMethods>;

const AccountSchema = new Schema<IAccountDoc, AccountModel, IAccountMethods>(
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

AccountSchema.pre("save", function (next) {
  var user = this;

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
    return await bcrypt.compare(p, this.password);
  }
);

const AccountModel = model("Account", AccountSchema);

export default AccountModel;
