import getFetch from './index';
import { PAPI } from '../helper/constants';

/** Document Save */
interface IPaymentBuilder {
}

export const MakePaymentBuilder = (): IPaymentBuilder => {
  const blueprint = {
    URL: PAPI,
    BODY: {
      title: '',
      content: '',
    },
    PATCH: (token) => getFetch(blueprint.URL).addToken(token).patch(blueprint.BODY),
  };

  return blueprint;
};
