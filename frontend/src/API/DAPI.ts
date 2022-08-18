import getFetch from './index';
import { DAPI } from '../helper/constants';

type PatchBody = {
  title?: string;
  content: string;
};

interface IDocumentSharedBuilder {
  URL: string;
  BODY: PatchBody;
}

/** Document Save */
interface IDocumentSaveBuilder extends IDocumentSharedBuilder {
  addDocumentIdParam(arg: string): IDocumentSaveBuilder;
  addRequestBody({ ...args }: PatchBody): IDocumentSaveBuilder;
  resetRequestBody(): IDocumentSaveBuilder;
  PATCH(arg: string | void): Promise<any>
}

export const DocumentSaveBuilder = (): IDocumentSaveBuilder => {
  const blueprint = {
    URL: `${DAPI}/save`,
    BODY: {
      title: '',
      content: '',
    },
    addDocumentIdParam: (id) => {
      if (!!id) blueprint.URL += `/${id}`;
      return blueprint;
    },
    addRequestBody: ({ title = '', content = '' }) => {
      blueprint.BODY = {
        title,
        content,
      };
      return blueprint;
    },
    resetRequestBody: () => {
      blueprint.BODY = {
        title: '',
        content: '',
      };
      return blueprint;
    },
    PATCH: (token) => getFetch(blueprint.URL).addToken(token).patch(blueprint.BODY),
  };

  return blueprint;
};

/** Document Create */
interface IDocumentCreateBuilder extends IDocumentSharedBuilder {
  addRequestBody({ ...args }: PatchBody): IDocumentCreateBuilder;
  resetRequestBody(): IDocumentCreateBuilder;
  POST(arg: string | void): Promise<any>
}

export const DocumentCreateBuilder = (): IDocumentCreateBuilder => {
  const blueprint = {
    URL: DAPI,
    BODY: {
      title: '',
      content: '',
    },
    addRequestBody: ({ title = '', content = '' }) => {
      blueprint.BODY = {
        title,
        content,
      };
      return blueprint;
    },
    resetRequestBody: () => {
      blueprint.BODY = {
        title: '',
        content: '',
      };
      return blueprint;
    },
    POST: (token) => getFetch(blueprint.URL).addToken(token).post(blueprint.BODY),
  };

  return blueprint;
};
