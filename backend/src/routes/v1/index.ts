import express from "express";
import { authLimiter } from "../../middlewares/rate-limiter";
import authRoutes from "./auth";

const router = express.Router();

// NOTE: limit repeated failed requests to auth endpoints
router.use("/auth", authLimiter, authRoutes);

export default router;
