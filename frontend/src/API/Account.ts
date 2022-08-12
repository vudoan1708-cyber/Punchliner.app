import getFetch from './index';
import { ACCOUNTAPI } from '../helper/constants';

type PostBody = {
  email: string;
  password: string;
  confirm: string;
}

interface IRegisterBuilder {
  URL: string;
  BODY: PostBody;
  addEmail(email: string): IRegisterBuilder;
  addPassword(password: string): IRegisterBuilder;
  addPasswordConfirm(confirm: string): IRegisterBuilder;
  POST(): Promise<{
    email,
    password,
    bearer,
  }>
};

export const RegisterBuilder: IRegisterBuilder = {
  URL: `${ACCOUNTAPI}/register`,
  BODY: {
    email: '',
    password: '',
    confirm: '',
  },
  addEmail: (email) => {
    RegisterBuilder.BODY.email = email;
    return RegisterBuilder;
  },
  addPassword: (password) => {
    RegisterBuilder.BODY.password = password;
    return RegisterBuilder;
  },
  addPasswordConfirm: (confirm) => {
    RegisterBuilder.BODY.confirm = confirm;
    return RegisterBuilder;
  },
  POST: () => {
    return getFetch(RegisterBuilder.URL, 'POST', RegisterBuilder.BODY);
  }
};
