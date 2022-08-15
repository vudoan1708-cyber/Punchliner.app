import { isDev } from '../helper/utilities';

type Options = {
  method?: string;
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
};

interface IGetFetch {
  options: Options;
  addToken(args: string): IGetFetch;
  get(): Promise<any>;
  post(args: object): Promise<any>;
  patch(args: object): Promise<any>;
}

/**
 * general fetch constructor
 *
 * @param   {string}  url     the url for the fetch call
 *
 * @return  {object}          the json object returned by the call
 */
const getFetch = (url: string): IGetFetch => {
  const jsonify = async (options: object): Promise<any> => {
    const res: Response = await fetch(url, options);
    if (res.status === 204) return null;
    const json = await res.json();

    // eslint-disable-next-line no-console
    if (isDev()) console.log(json);

    return json;
  };

  const fetchCall: IGetFetch = {
    options: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },

    addToken: (token) => {
      fetchCall.options.headers = {
        ...fetchCall.options.headers,
        Authorization: `Bearer ${token}`,
      };
      return fetchCall;
    },

    get: async () => {
      fetchCall.options = {
        method: 'GET',
        ...fetchCall.options,
      };
      return jsonify(fetchCall.options);
    },

    post: async (body = {}) => {
      fetchCall.options = {
        method: 'POST',
        body: JSON.stringify(body),
        ...fetchCall.options,
      };
      return jsonify(fetchCall.options);
    },

    patch: async (body = {}) => {
      fetchCall.options = {
        method: 'PATCH',
        body: JSON.stringify(body),
        ...fetchCall.options,
      };
      return jsonify(fetchCall.options);
    },
  };

  return fetchCall;
};

export default getFetch;
