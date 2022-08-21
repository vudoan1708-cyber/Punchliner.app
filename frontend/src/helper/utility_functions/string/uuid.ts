/**
 * simple time-based UID generator - ideal for cache busting
 * @param   {string}  character  the optional string to be turn into a unique ID
 *
 * @returns {string} a UID
*/
export default (character: string | void = null): string => {
  if (!character) return new Date().getTime().toString(32).toUpperCase();
  return character.split(' ').join('_').toLowerCase();
};
