import httpStatus from "http-status";
import AccountModel from "../models/account";
import {
  LOGIN_WRONG_PASSWORD,
  USER_ALREADY_EXISTED,
  USER_NOT_FOUND,
} from "../shared/error-codes";
import { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { createResponse } from "../utils/response";

const login: RequestHandlerWithType<{
  email: string;
  password: string;
}> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existedAccount = await AccountModel.findOne({ email });

    if (!existedAccount) {
      throw new ApiError(httpStatus.NOT_FOUND, USER_NOT_FOUND, true);
    }

    const isCorrectPassword = await existedAccount.comparePassword(password);

    if (!isCorrectPassword) {
      throw new ApiError(httpStatus.FORBIDDEN, LOGIN_WRONG_PASSWORD, true);
    }

    existedAccount.password = "";

    res.status(httpStatus.OK).json(createResponse(existedAccount));
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

    res.status(201).json(createResponse(newAccount));
  } catch (e) {
    next(e);
  }
};

export default { login, register };
