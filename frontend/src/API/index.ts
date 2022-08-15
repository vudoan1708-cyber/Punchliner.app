import { isDev } from '../helper/utilities';

interface IGetFetch {
  get(): Promise<any>;
  post({ ...args }: object): Promise<any>;
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
    const _options_ = {
      ...options,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
    const res: Response = await fetch(url, _options_);
    if (res.status === 204) return;
    const json = await res.json();

    if (isDev()) console.log(json);

    return json;
  };

  const fetchCall = {
    get: async (): Promise<any> => {
      const options = {
        method: 'GET',
      }
      return jsonify(options);
    },

    post: async (body: object = {}): Promise<any> => {
      const options = {
        method: 'POST',
        body: JSON.stringify(body),
      };
      return jsonify(options);
    },
  };

  return fetchCall;
};

export default getFetch;
