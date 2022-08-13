import rateLimit from "express-rate-limit";
import configs from "../configs";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  skipSuccessfulRequests: true,
  skip: (request, response) => configs.ENV !== "production", // NOTE: only enable on production
});

export { authLimiter };
