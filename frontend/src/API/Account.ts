/* eslint-disable no-unused-vars */

import getFetch from './index';
import { ACCOUNTAPI } from '../helper/constants';

type PostBody = {
  email: string;
  password: string;
  confirm: string;
}

/** Register Endpoint */
interface IRegisterBuilder {
  URL: string;
  BODY: PostBody;
  addRequestBody(requestObj: PostBody): IRegisterBuilder;
  POST(): Promise<any>
}

export const RegisterBuilder: IRegisterBuilder = {
  URL: `${ACCOUNTAPI}/register`,
  BODY: {
    email: '',
    password: '',
    confirm: '',
  },
  addRequestBody: ({ email = '', password = '', confirm = '' }) => {
    RegisterBuilder.BODY = {
      email,
      password,
      confirm,
    };
    return RegisterBuilder;
  },
  POST: () => getFetch(RegisterBuilder.URL, 'POST', RegisterBuilder.BODY),
};
/** Register Endpoint */

/** Login Endpoint */
type LoginPostBody = Omit<PostBody, 'confirm'>;

interface ILoginBuilder {
  URL: string;
  BODY: LoginPostBody;
  addRequestBody(requestObj: LoginPostBody): ILoginBuilder;
  POST(): Promise<any>
}

export const LoginBuilder: ILoginBuilder = {
  URL: `${ACCOUNTAPI}/login`,
  BODY: {
    email: '',
    password: '',
  },
  addRequestBody: ({ email = '', password = '' }) => {
    LoginBuilder.BODY = {
      email,
      password,
    };
    return LoginBuilder;
  },
  POST: () => getFetch(LoginBuilder.URL, 'POST', LoginBuilder.BODY),
};
