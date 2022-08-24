import httpStatus from "http-status";
import type { Stripe } from "stripe";
import type { RequestHandlerWithType } from "../shared/request-type";
import { createResponse } from "../utils/response";
import ApiError from "../utils/api-error";
import { UNAUTHORIZED } from "../shared/error";
import StripeVendor from "../vendor/stripe";

type PaymentCheckoutRequest = RequestHandlerWithType<any, any>;

const checkout: PaymentCheckoutRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, UNAUTHORIZED, true);
    }

    const stripe_cus_id = req.user.stripe_cus_id;

    const session = await StripeVendor.createCheckoutSession(stripe_cus_id);

    res.status(httpStatus.OK).json(
      createResponse({
        session,
      })
    );
  } catch (e) {
    next(e);
  }
};

const registerStripeWebhookEvents: RequestHandlerWithType<any, any> = (
  request,
  response
) => {
  const sig = request.headers["stripe-signature"];

  let event: Stripe.Event | null = null;

  try {
    event = StripeVendor.constructWebhookEvent(request.body, sig);
  } catch (err: Error | any) {
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
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled Stripe webhook event type ${event.type}`);
    }
  } else {
    response.status(500).send("Webhook Error: cannot construct webhook event");
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

export default {
  checkout,
  registerStripeWebhookEvents,
};
