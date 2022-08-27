import httpStatus from "http-status";
import AccountModel from "../models/account";
import { USER_ALREADY_EXISTED, UNAUTHORIZED } from "../shared/error";
import { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { createResponse } from "../utils/response";
import AuthService from "../services/auth.service";
import Stripe from "../vendor/stripe";

const login: RequestHandlerWithType<{
  email: string;
  password: string;
}> = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const user = req.user;

    const token = AuthService.signJwtToken({ user: req.user });

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

    const existedAccount = await AccountModel.findOne({ email });

    if (existedAccount) {
      throw new ApiError(httpStatus.CONFLICT, USER_ALREADY_EXISTED, true);
    }

    // NOTE: create Stripe customer
    const customer = await Stripe.addNewCustomer(email);

    if (!customer) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        USER_ALREADY_EXISTED,
        false
      );
    }

    const newAccount = new AccountModel({
      email,
      password,
      stripe_cus_id: customer.id,
    });

    const updatedAccount = await newAccount.save();

    updatedAccount.password = "";

    const tokenPayload = {
      _id: updatedAccount._id.toString(),
      email: updatedAccount.email,
      type: updatedAccount.type,
      stripe_cus_id: updatedAccount.stripe_cus_id,
    };

    const token = AuthService.signJwtToken({ user: tokenPayload });

    res
      .status(201)
      .json(createResponse({ user: updatedAccount, bearer: token }));
  } catch (e) {
    next(e);
  }
};

export default { login, register };
