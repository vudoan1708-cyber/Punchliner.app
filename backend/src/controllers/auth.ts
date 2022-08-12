import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import AccountModel from "../models/account";
import {
  LOGIN_WRONG_PASSWORD,
  USER_ALREADY_EXISTED,
  USER_NOT_FOUND,
} from "../shared/error-codes";
import { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { createResponse } from "../utils/response";
import configs from "../configs";

// TODO: move to service
function signJwtToken(email: string, _id: string): string {
  return jwt.sign(
    {
      username: email,
      _id: _id,
      sub: _id,
    },
    configs.JWT_SECRET
  );
}

const login: RequestHandlerWithType<{
  email: string;
  password: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, USER_NOT_FOUND, true);
    }

    const u = req.user as unknown as { email: string; _id: string };

    const token = signJwtToken(u.email, u._id);

    res.status(200).send(createResponse({ user: req.user, bearer: token }));
  } catch (error) {
    next(error);
  }
};

const register: RequestHandlerWithType<{
  email: string;
  password: string;
  confirm: string;
}> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existed = await AccountModel.findOne({ email });

    if (existed) {
      throw new ApiError(httpStatus.CONFLICT, USER_ALREADY_EXISTED, true);
    }

    const newAccount = new AccountModel({
      email,
      password,
    });

    await newAccount.save();

    newAccount.password = "";

    const token = signJwtToken(newAccount.email, newAccount._id.toString());

    res.status(201).json(createResponse({ user: newAccount, bearer: token }));
  } catch (e) {
    next(e);
  }
};

export default { login, register };
