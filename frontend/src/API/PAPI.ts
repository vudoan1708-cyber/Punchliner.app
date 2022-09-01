import getFetch from './index';
import { PAPI } from '../helper/constants';

/** Document Save */
interface IPaymentBuilder {
  URL: string;
}

interface IPaymentCheckoutBuilder extends IPaymentBuilder {
  GET(arg: string | void): Promise<any>
}

export const PaymentCheckoutBuilder = (): IPaymentCheckoutBuilder => {
  const blueprint = {
    URL: `${PAPI}/checkout`,
    GET: (token) => getFetch(blueprint.URL).addToken(token).get(),
  };

  return blueprint;
};
