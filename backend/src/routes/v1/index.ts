import express from "express";
import passport from "passport";
import { authLimiter } from "../../middlewares/rate-limiter";
import AuthRoutes from "./auth";
import DocumentRoutes from "./document";
import PaymentRoutes from "./payment";

const router = express.Router();

// NOTE: limit repeated failed requests to auth endpoints
router.use("/auth", authLimiter, AuthRoutes);

// NOTE: JWT-protected routes
router.use(
  "/document",
  passport.authenticate("jwt", { session: false }),
  DocumentRoutes
);

// NOTE: JWT-protected routes
router.use("/payment", PaymentRoutes);

export default router;
