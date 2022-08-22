import type { Stripe } from "stripe";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User {
      _id: string;
      email: string;
    }

    // Inject additional properties on express.Request
    export interface Request {
      session: session.Session &
        Partial<session.SessionData> & {
          customer?: Stripe.Customer;
        };
    }
  }
}
