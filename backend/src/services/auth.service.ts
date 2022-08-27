import jwt from "jsonwebtoken";
import configs from "../configs";
import type { Request } from "express";

type UserPayload = Pick<Request, "user">;

function signJwtToken({ user }: UserPayload): string {
  return jwt.sign(
    {
      _id: user?._id,
      sub: user?._id,
      email: user?.email,
      type: user?.type,
      stripe_cus_id: user?.stripe_cus_id,
    },
    configs.JWT_SECRET,
    {
      expiresIn: "3d", // 3 days
    }
  );
}

export default { signJwtToken };
