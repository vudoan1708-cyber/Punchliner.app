import jwt from "jsonwebtoken";
import configs from "../configs";
import { JWT_EXPIRATION_IN_MS } from "../shared/expiration";
import CacheManager from "../configs/cache";
import type { Request } from "express";

type UserPayload = Pick<Request, "user">;

function signJwtToken({ user }: UserPayload): string {
  if (user?._id) {
    const signedJWT = jwt.sign(
      {
        _id: user?._id,
        sub: user?._id,
        email: user?.email,
        type: user?.type,
        stripe_cus_id: user?.stripe_cus_id,
      },
      configs.JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION_IN_MS, // 3 days
      }
    );
    CacheManager.setUserJWT(user?._id?.toString(), signedJWT);
    return signedJWT;
  }
  return "";
}

export default { signJwtToken };
