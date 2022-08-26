import express from "express";
import passport from "passport";
import PaymentController from "../../controllers/payment";

const router = express.Router();

router.get(
  "/checkout",
  passport.authenticate("jwt", { session: false }),
  PaymentController.checkout
);

router.get("/checkout/success", PaymentController.checkoutSuccessHTML);

export default router;
