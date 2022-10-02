import httpStatus from "http-status";
import { USER_ALREADY_EXISTED, UNAUTHORIZED } from "../shared/error";
import { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { createResponse } from "../utils/response";
import AuthService from "../services/auth.service";
import AccountService from "../services/account.service";

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

    const existedAccount = await AccountService.findAccountByEmail(email);

    if (existedAccount) {
      throw new ApiError(httpStatus.CONFLICT, USER_ALREADY_EXISTED, true);
    }

    // // NOTE: create Stripe customer
    // const stripeCustomer = await Stripe.addNewCustomer(email);

    // if (!stripeCustomer) {
    //   throw new ApiError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     USER_ALREADY_EXISTED,
    //     false
    //   );
    // }

    const payload = {
      email,
      password,
      stripe_cus_id: "empty",
      // stripe_cus_id: stripeCustomer.id,
    };

    const createdAccount = await AccountService.createNewAccount(payload);

    if (!createdAccount) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        USER_ALREADY_EXISTED,
        false
      );
    }

    createdAccount.password = "";

    const tokenPayload = {
      _id: createdAccount.id,
      email: createdAccount.email,
      type: createdAccount.type,
      stripe_cus_id: createdAccount.stripe_cus_id,
    };

    const token = AuthService.signJwtToken({ user: tokenPayload });

    res
      .status(201)
      .json(createResponse({ user: createdAccount, bearer: token }));
  } catch (e) {
    next(e);
  }
};

export default { login, register };
