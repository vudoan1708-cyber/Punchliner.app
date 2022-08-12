/**
 * general fetch constructor
 *
 * @param   {string}  url     the url for the fetch call
 * @param   {string}  method  the method to use
 * @param   {object}  body    the json object which will be added to the request body as a string
 *
 * @return  {object}          the json object returned by the call
 */
const getFetch = async (url: string, method: string = 'GET', body: object = {}): Promise<any> => {
  const options = {
    method,
    body: JSON.stringify(body),
  };
  if (method === 'GET') { // GET requests can't have a body
    delete options.body;
  }
  const res: Response = await fetch(url, options);
  if (res.status === 204) return;
  const json = await res.json();
  return json;
};

export default getFetch;
