import httpStatus from "http-status";
import ApiError from "../utils/api-error";
import { NOT_PREMIUM_USER, UNAUTHORIZED } from "../shared/error";
import { AppUserType } from "../types/user-type";
import type { RequestHandlerWithType } from "../shared/request-type";

const isPremiumUser: RequestHandlerWithType<any, any> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    if (req.user.type !== AppUserType.PREMIUM) {
      throw new ApiError(httpStatus.FORBIDDEN, NOT_PREMIUM_USER, true);
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default isPremiumUser;
