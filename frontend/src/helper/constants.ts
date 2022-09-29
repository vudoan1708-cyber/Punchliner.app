import { isDev } from './utilities';

import { PLACEHOLDER } from './utility_variables/text';
import { BROWSER } from './utility_variables/browsers';

export const ACCOUNTAPI = isDev() ? 'http://localhost:3333/api/v2/auth' : 'https://www.punchliner.app/api/v2/auth';
export const DAPI = isDev() ? 'http://localhost:3333/api/v2/document' : 'https://www.punchliner.app/api/v2/document';
export const PAPI = isDev() ? 'http://localhost:3333/api/v2/payment' : 'https://www.punchliner.app/api/v2/payment';

export const USER_TYPE = {
  PREMIUM: 'PREMIUM',
  NORMAL: 'NORMAL',
};

export { PLACEHOLDER, BROWSER };
