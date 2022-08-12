import { isDev } from './utilities';

import { PLACEHOLDER } from "./utility_variables/text";
import { BROWSER } from "./utility_variables/browsers";

export const ACCOUNTAPI = isDev ? 'localhost:8080/v1/auth' : 'v1/auth';
export const DAPI = isDev ? 'localhost:8080/v1/documents' : 'v1/documents';

export { PLACEHOLDER, BROWSER };
