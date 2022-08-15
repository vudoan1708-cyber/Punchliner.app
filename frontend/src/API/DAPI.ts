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
  addRequestBody({ ...args }: PatchBody): IDocumentSaveBuilder;
  resetRequestBody(): IDocumentSaveBuilder;
  PATCH(): Promise<any>
}

export const DocumentSaveBuilder = (): IDocumentSaveBuilder => {
  const blueprint = {
    URL: `${DAPI}/register`,
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
    PATCH: () => getFetch(blueprint.URL).post(blueprint.BODY),
  };

  return blueprint;
};
