import { isDev } from './utilities';

import { PLACEHOLDER } from './utility_variables/text';
import { BROWSER } from './utility_variables/browsers';

export const ACCOUNTAPI = isDev ? 'http://localhost:3333/v1/auth' : 'v1/auth';
export const DAPI = isDev ? 'http://localhost:3333/v1/document' : 'v1/document';

export { PLACEHOLDER, BROWSER };
