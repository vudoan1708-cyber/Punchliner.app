import express from "express";
import passport from "passport";
import { authLimiter } from "../../middlewares/rate-limiter";
import AuthRoutes from "./auth";
import DocumentRoutes from "./document";

const router = express.Router();

// NOTE: limit repeated failed requests to auth endpoints
router.use("/auth", authLimiter, AuthRoutes);

// NOTE: JWT-protected routes
router.use(
  "/document",
  passport.authenticate("jwt", { session: false }),
  DocumentRoutes
);

export default router;
