import stripe from "stripe";
import type { Stripe as StripeTypes } from "stripe";
import configs from "../configs";

const Stripe = new stripe(configs.STRIPE_API_KEY, {
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
): Promise<
  StripeTypes.Response<StripeTypes.Customer | StripeTypes.DeletedCustomer>
> => {
  const customer = await Stripe.customers.retrieve(id);
  return customer;
};

const createCheckoutSession = async (customer: string, price?: string) => {
  const session = await Stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14,
    },
    success_url: `${configs.HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.HOST}/failed`,
  });

  return session;
};

export default {
  addNewCustomer,
  getCustomerByID,
  createCheckoutSession,
};
