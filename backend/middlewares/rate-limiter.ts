import rateLimit from "express-rate-limit";
import configs from "../configs";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // 20 per 15 minutes
  skipSuccessfulRequests: true,
  skip: (request, response) => configs.ENV !== "production", // NOTE: only enable on production
});

const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 2, // 2 per 5 minutes
  skipSuccessfulRequests: false,
  skip: (request, response) => configs.ENV !== "production", // NOTE: only enable on production
});

export { authLimiter, paymentLimiter };
