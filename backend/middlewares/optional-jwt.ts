import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import configs from "../configs";
import logger from "../configs/logger";

export default function optionalJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // invalid token - synchronous
  try {
    const bearer = req.headers["authorization"]?.split("Bearer ")?.[1];
    if (bearer) {
      const decoded = jwt.verify(bearer, configs.JWT_SECRET);
      if (typeof decoded !== "string") {
        req.user = { ...(decoded as Express.User) };
      }
    }
  } catch (e) {
    logger.error("its ok with: " + e);
  } finally {
    next();
  }
}
