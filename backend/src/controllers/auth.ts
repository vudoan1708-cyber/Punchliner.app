import httpStatus from "http-status";
import AccountModel from "../models/account";
import { USER_ALREADY_EXISTED, UNAUTHORIZED } from "../shared/error";
import { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { createResponse } from "../utils/response";
import AuthService from "../services/auth.service";

const login: RequestHandlerWithType<{
  email: string;
  password: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const user = req.user;

    const token = AuthService.signJwtToken(user.email, user._id);

    res.status(200).send(createResponse({ user, bearer: token }));
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

    const token = AuthService.signJwtToken(
      newAccount.email,
      newAccount._id.toString()
    );

    res.status(201).json(createResponse({ user: newAccount, bearer: token }));
  } catch (e) {
    next(e);
  }
};

export default { login, register };
