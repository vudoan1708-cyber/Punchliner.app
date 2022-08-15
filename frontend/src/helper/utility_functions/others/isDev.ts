/**
 * Use to intercept code for local development e.g. use mock API calls
 *
 * @returns {boolean} is the current page running in a dev context
*/
export default (): boolean => (
  (window.location.hostname === 'localhost')
);
