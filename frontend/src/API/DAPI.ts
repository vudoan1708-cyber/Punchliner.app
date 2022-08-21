import getFetch from './index';
import { DAPI } from '../helper/constants';

type PatchBody = {
  title?: string;
  content: string;
};
type ShareBody = {
  passcode: string;
};

interface IDocumentBuilder {
  URL: string;
  BODY?: PatchBody | ShareBody;
}

/** Document Save */
interface IDocumentSaveBuilder extends IDocumentBuilder {
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
interface IDocumentCreateBuilder extends IDocumentBuilder {
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

/** Document Overview */
interface IDocumentOverviewBuilder extends IDocumentBuilder {
  addDefaultParams(): IDocumentOverviewBuilder;
  addPage(arg: number | string): IDocumentOverviewBuilder;
  addPageSize(arg: number | string): IDocumentOverviewBuilder;
  GET(token): Promise<any>
}

export const DocumentOverviewBuilder = (): IDocumentOverviewBuilder => {
  const startOfQuerystring = (url: string): boolean => url[url.length - 1] === '?';

  const blueprint = {
    URL: `${DAPI}/overview?`,
    addDefaultParams: () => {
      blueprint.URL = `${DAPI}/overview?page=1&pageSize=3`;
      return blueprint;
    },
    addPage: (page = 1) => {
      blueprint.URL += !!startOfQuerystring(blueprint.URL) ? `page=${page}` : `&page=${page}`;
      return blueprint;
    },
    addPageSize: (pageSize = 3) => {
      blueprint.URL += !!startOfQuerystring(blueprint.URL) ? `pageSize=${pageSize}` : `&pageSize=${pageSize}`;
      return blueprint;
    },
    GET: (token) => getFetch(blueprint.URL).addToken(token).get(),
  };

  return blueprint;
};

/** Document Query */
interface IDocumentQueryBuilder extends IDocumentBuilder {
  addDocumentId(arg: string): IDocumentQueryBuilder;
  GET(token): Promise<any>
}

export const DocumentQueryBuilder = (): IDocumentQueryBuilder => {
  const blueprint = {
    URL: DAPI,
    addDocumentId: (id) => {
      blueprint.URL += `/${id}`;
      return blueprint;
    },
    GET: (token) => getFetch(blueprint.URL).addToken(token).get(),
  };

  return blueprint;
};

/** Document Share */
interface IDocumentShareBuilder extends IDocumentBuilder {
  addDocumentId(arg: string | void): IDocumentShareBuilder;
  addPasscode(arg: string | void): IDocumentShareBuilder;
  POST(token): Promise<any>
}

export const DocumentShareBuilder = (): IDocumentShareBuilder => {
  const blueprint = {
    URL: `${DAPI}/share`,
    BODY: {
      passcode: '',
    },
    addDocumentId: (id) => {
      blueprint.URL += `/${id}`;
      return blueprint;
    },
    addPasscode: (passcode) => {
      blueprint.BODY.passcode = passcode;
      return blueprint;
    },
    POST: (token) => getFetch(blueprint.URL).addToken(token).post(blueprint.BODY),
  };

  return blueprint;
};
