import express from "express";
import PaymentController from "../../controllers/payment";

const router = express.Router();

router.get("/checkout", PaymentController.checkout);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.registerStripeWebhookEvents
);

export default router;
