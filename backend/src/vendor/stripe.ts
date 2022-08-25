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
  if (
    !configs.STRIPE ||
    !configs.STRIPE.PREMIUM_PRODUCT_ID ||
    !configs.STRIPE.CHECKOUT_SUCCESS_URL ||
    !configs.STRIPE.CHECKOUT_CANCEL_URL
  ) {
    throw Error("missing custom Stripe config");
  }

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
    success_url: configs.STRIPE.CHECKOUT_SUCCESS_URL,
    cancel_url: configs.STRIPE.CHECKOUT_CANCEL_URL,
  });

  return session;
};

// req.query.session_id
const getCustomerFromSession = async (
  sessionId: string
): Promise<stripe.Customer | null> => {
  const session = await Stripe.checkout.sessions.retrieve(sessionId);
  if (!session || !session.customer) return null;
  const customerId = session.customer.toString();
  const customer = await Stripe.customers.retrieve(customerId);
  return customer as stripe.Customer | null;
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
  getCustomerFromSession,
};
