import httpStatus from "http-status";
import ApiError from "../utils/api-error";
import { UNAUTHORIZED } from "../shared/error";
import StripeVendor from "../vendor/stripe";
import { CANNOT_CREATE_STRIPE_CHECKOUT_SESSION } from "../shared/error/error.payment";
import AccountModel, { AppUserTypeEnum } from "../models/account";
import CacheManager from "../configs/cache";
import type { Stripe } from "stripe";
import type { RequestHandler } from "express";
import type { RequestHandlerWithType } from "../shared/request-type";

type PaymentCheckoutRequest = RequestHandlerWithType<any, any>;

const checkout: PaymentCheckoutRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }
    const stripe_cus_id = req.user.stripe_cus_id;
    const session = await StripeVendor.createCheckoutSession(stripe_cus_id);
    if (!session || !session.url) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        CANNOT_CREATE_STRIPE_CHECKOUT_SESSION,
        true
      );
    }

    res.status(httpStatus.TEMPORARY_REDIRECT).redirect(session.url);
  } catch (e) {
    next(e);
  }
};

const registerStripeWebhookEvents: RequestHandler = async (
  request,
  response
) => {
  const sig = request.headers["stripe-signature"];
  let event: Stripe.Event | null = null;

  try {
    event = StripeVendor.constructWebhookEvent(request.body, sig as any);
  } catch (err: Error | any) {
    console.log(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    if (event) {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const raw = event.data.object;

          const paymentIntent = raw as Stripe.PaymentIntent;

          const stripeCusId =
            typeof paymentIntent.customer === "string"
              ? paymentIntent.customer
              : paymentIntent.customer?.id;

          const updatedAccount = await AccountModel.findOneAndUpdate(
            {
              stripe_cus_id: stripeCusId,
              type: AppUserTypeEnum.NORMAL,
            },
            {
              $set: {
                type: AppUserTypeEnum.PREMIUM,
              },
            }
          );

          // NOTE: force user logout
          if (updatedAccount) {
            CacheManager.removeJWT(updatedAccount._id.toString());
          }

          break;
        }
      }
    } else {
      response
        .status(500)
        .send("Webhook Error: cannot construct webhook event");
      return;
    }
  } catch (error) {
    console.error("Stripe webhook error:", error);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

export default {
  checkout,
  registerStripeWebhookEvents,
};
