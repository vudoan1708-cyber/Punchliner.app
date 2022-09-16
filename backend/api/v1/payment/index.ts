import express from "express";
import passport from "passport";
import PaymentController from "../../../controllers/payment";
import { paymentLimiter } from "../../../middlewares/rate-limiter";

const router = express.Router();

router.get(
  "/checkout",
  passport.authenticate("jwt", { session: false }),
  paymentLimiter,
  PaymentController.checkout
);

// router.get("/checkout/success", PaymentController.checkoutSuccessHTML);

export default router;
