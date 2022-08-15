import getFetch from './index';
import { DAPI } from '../helper/constants';

type PatchBody = {
  title?: string;
  content: string;
};

/** Document Save */
interface IDocumentSaveBuilder {
  URL: string;
  BODY: PatchBody;
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
    PATCH: (token) => getFetch(blueprint.URL).addToken(token).post(blueprint.BODY),
  };

  return blueprint;
};
