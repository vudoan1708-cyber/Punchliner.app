import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import httpStatus from "http-status";
import CacheManager from "../configs/cache";
import { UNAUTHORIZED } from "../shared/error";
import { AppUserTypeEnum } from "../models/account";
import ApiError from "../utils/api-error";
import { INVALID_PASSWORD_ERROR, USER_NOT_FOUND } from "../shared/error";
import AccountService from "../services/account.service";
import PasswordUtil from "../utils/password";
import configs from "../configs";
import type { Request } from "express";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// function cookieJwtExtractor(req: Request) {
//   if (!req || !req.cookies) return null;
//   if (req && req.cookies) return req.cookies["jwt"];
// }

export const PassportLocalStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const account = await AccountService.findAccountByEmail(email);

      if (!account) {
        return done(
          new ApiError(httpStatus.NOT_FOUND, USER_NOT_FOUND, true),
          undefined
        );
      }

      const isMatch = await PasswordUtil.isPasswordMatch(
        password,
        account.password
      );

      if (!isMatch) {
        return done(
          new ApiError(httpStatus.FORBIDDEN, INVALID_PASSWORD_ERROR, true),
          undefined
        );
      }

      return done(undefined, {
        email: account.email,
        _id: account.id,
        type: account.type ?? AppUserTypeEnum.NORMAL,
        stripe_cus_id: account.stripe_cus_id,
      });
    } catch (error) {
      done(error);
    }
  }
);

export const PassportJWTStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.JWT_SECRET,
    passReqToCallback: true,
    // audience: "",
    // issuer: "",
  },
  function (req: Request, payload: any, done: any) {
    const bearer = req.headers["authorization"]?.split("Bearer ")?.[1];
    const hasJWT = CacheManager.hasJWT(payload.sub, bearer as string);
    if (!hasJWT) {
      return done(new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true));
    }
    return done(
      undefined,
      {
        _id: payload.sub,
        email: payload.email,
        type: payload.type,
        stripe_cus_id: payload.stripe_cus_id,
      },
      payload
    );
  }
);
