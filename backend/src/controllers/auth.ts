import type { RequestHandler } from "express";
import AccountModel from "../models/account";

const login: RequestHandler = (req, res, next) => {
  const _accounts = AccountModel.find({});
};

export default { login };
