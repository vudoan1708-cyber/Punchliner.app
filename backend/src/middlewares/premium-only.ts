import httpStatus from "http-status";
import type { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { NOT_PREMIUM_USER, UNAUTHORIZED } from "../shared/error";
import { AppUserTypeEnum } from "../models/account";

const isPremiumUser: RequestHandlerWithType<any, any> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    if (req.user.type !== AppUserTypeEnum.PREMIUM) {
      throw new ApiError(httpStatus.FORBIDDEN, NOT_PREMIUM_USER, true);
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default isPremiumUser;
