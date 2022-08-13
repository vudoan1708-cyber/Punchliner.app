interface IGetFetch {
  get(): Promise<any>;
  post(body: object): Promise<any>;
}

/**
 * general fetch constructor
 *
 * @param   {string}  url     the url for the fetch call
 * @param   {object}  body    the json object which will be added to the request body as a string
 *
 * @return  {object}          the json object returned by the call
 */
const getFetch = (url: string): IGetFetch => {
  const jsonify = async (options: object): Promise<any> => {
    const res: Response = await fetch(url, options);
    if (res.status === 204) return;
    const json = await res.json();
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
