/* eslint-disable no-unused-vars */

import getFetch from './index';
import { ACCOUNTAPI } from '../helper/constants';

type PostBody = {
  email: string;
  password: string;
  confirm: string;
};

/** Register Endpoint */
interface IRegisterBuilder {
  URL: string;
  BODY: PostBody;
  addRequestBody({ ...args }: PostBody): IRegisterBuilder;
  resetRequestBody(): IRegisterBuilder;
  POST(): Promise<any>
}

export const RegisterBuilder = (): IRegisterBuilder => {
  const blueprint = {
    URL: `${ACCOUNTAPI}/register`,
    BODY: {
      email: '',
      password: '',
      confirm: '',
    },
    addRequestBody: ({ email = '', password = '', confirm = '' }) => {
      blueprint.BODY = {
        email,
        password,
        confirm,
      };
      return blueprint;
    },
    resetRequestBody: () => {
      blueprint.BODY = {
        email: '',
        password: '',
        confirm: '',
      };
      return blueprint;
    },
    POST: () => getFetch(blueprint.URL).post(blueprint.BODY),
  };

  return blueprint;
};
/** Register Endpoint */

/** Login Endpoint */
type LoginPostBody = Omit<PostBody, 'confirm'>;

interface ILoginBuilder {
  URL: string;
  BODY: LoginPostBody;
  addRequestBody({ ...args }: LoginPostBody): ILoginBuilder;
  resetRequestBody(): ILoginBuilder;
  POST(): Promise<any>
}

export const LoginBuilder = (): ILoginBuilder => {
  const blueprint = {
    URL: `${ACCOUNTAPI}/login`,
    BODY: {
      email: '',
      password: '',
    },
    addRequestBody: ({ email = '', password = '' }) => {
      blueprint.BODY = {
        email,
        password,
      };
      return blueprint;
    },
    resetRequestBody: () => {
      blueprint.BODY = {
        email: '',
        password: '',
      };
      return blueprint;
    },
    POST: () => getFetch(blueprint.URL).post(blueprint.BODY),
  };

  return blueprint;
};
