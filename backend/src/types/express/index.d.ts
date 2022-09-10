import { AppUserTypeEnum } from "../../models/account";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User {
      _id: string;
      email: string;
      stripe_cus_id: string;
      type: string | AppUserTypeEnum;
    }
  }
}
