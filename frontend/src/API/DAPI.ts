import getFetch from './index';
import { DAPI } from '../helper/constants';

type PatchBody = {
  title?: string;
  content: string;
};

/* Document Save */
interface IDocumentSaveBuilder {
  URL: string;
  BODY: PatchBody;
  addRequestBody({ ...args }: PatchBody): IDocumentSaveBuilder;
  resetRequestBody(): IDocumentSaveBuilder;
  PATCH(): Promise<any>
}
