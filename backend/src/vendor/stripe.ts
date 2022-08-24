import { Request } from "express";
import stripe from "stripe";
import configs from "../configs";

const Stripe = new stripe(configs.STRIPE.API_KEY, {
  apiVersion: "2022-08-01",
});

const addNewCustomer = async (email: string) => {
  const customer = await Stripe.customers.create({
    email,
    description: "Punchliner customer",
  });

  return customer;
};

const getCustomerByID = async (
  id: string
): Promise<stripe.Response<stripe.Customer | stripe.DeletedCustomer>> => {
  const customer = await Stripe.customers.retrieve(id);
  return customer;
};

const createCheckoutSession = async (
  customer: string,
  price = configs.STRIPE.PREMIUM_PRODUCT_ID
) => {
  const session = await Stripe.checkout.sessions.create({
    customer,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    // subscription_data: {
    //   trial_period_days: 14,
    // },
    success_url: `${configs.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.DOMAIN}/failed`,
  });

  return session;
};

const constructWebhookEvent = (req: Request, sig?: string | string[]) => {
  if (!sig || !configs?.STRIPE?.WEBHOOK_ENDPOINT_SECRET) return null;
  return Stripe.webhooks.constructEvent(
    req.body,
    sig,
    configs.STRIPE.WEBHOOK_ENDPOINT_SECRET
  );
};

export default {
  addNewCustomer,
  getCustomerByID,
  createCheckoutSession,
  constructWebhookEvent,
};
