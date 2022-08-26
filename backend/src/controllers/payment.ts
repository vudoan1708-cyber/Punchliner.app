import stripe from "stripe";
import httpStatus from "http-status";
import type { Stripe } from "stripe";
import type { RequestHandlerWithType } from "../shared/request-type";
import ApiError from "../utils/api-error";
import { UNAUTHORIZED, USER_NOT_FOUND } from "../shared/error";
import StripeVendor from "../vendor/stripe";
import { CANNOT_CREATE_STRIPE_CHECKOUT_SESSION } from "../shared/error/error.payment";
import type { RequestHandler } from "express";

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

const registerStripeWebhookEvents: RequestHandler = (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event: Stripe.Event | null = null;

  try {
    event = StripeVendor.constructWebhookEvent(request.body, sig as any);
  } catch (err: Error | any) {
    console.log(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event) {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        // TODO: mark user as premium
        console.log("marked user as PREMIUM: ", session);
        break;
      // ... handle other event types
      default:
      // console.log(`Unhandled Stripe webhook event type ${event.type}`);
    }
  } else {
    response.status(500).send("Webhook Error: cannot construct webhook event");
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

type PaymentCheckoutSuccessRequest = RequestHandlerWithType<
  any,
  { session_id: string }
>;

const checkoutSuccessHTML: PaymentCheckoutSuccessRequest = async (
  req,
  res,
  next
) => {
  try {
    const { session_id } = req.query;

    const customer = await StripeVendor.getCustomerFromSession(session_id);

    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, USER_NOT_FOUND, true);
    }
    res.render("checkout-success", {
      name: customer.name,
      email: customer.email,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  checkout,
  checkoutSuccessHTML,
  registerStripeWebhookEvents,
};
