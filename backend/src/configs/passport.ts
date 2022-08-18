import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import httpStatus from "http-status";
import AccountModel from "../models/account";
import ApiError from "../utils/api-error";
import { INVALID_PASSWORD_ERROR, USER_NOT_FOUND } from "../shared/error";
import configs from "../configs";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// function cookieJwtExtractor(req: Request) {
//   if (!req || !req.cookies) return null;
//   if (req && req.cookies) return req.cookies["jwt"];
// }

export const PassportLocalStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (username, password, done) => {
    try {
      const account = await AccountModel.findOne({ email: username });

      if (!account) {
        return done(
          new ApiError(httpStatus.NOT_FOUND, USER_NOT_FOUND, true),
          undefined
        );
      }

      const isMatch = await account.comparePassword(password);

      if (!isMatch) {
        return done(
          new ApiError(httpStatus.FORBIDDEN, INVALID_PASSWORD_ERROR, true),
          undefined
        );
      }

      return done(undefined, { email: account.email, _id: account._id });
    } catch (error) {
      done(error);
    }
  }
);

export const PassportJWTStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.JWT_SECRET,
    // audience: "",
    // issuer: "",
  },
  function (jwtToken, done) {
    return done(
      undefined,
      { _id: jwtToken.sub, email: jwtToken.username || jwtToken.email },
      jwtToken
    );
  }
);
