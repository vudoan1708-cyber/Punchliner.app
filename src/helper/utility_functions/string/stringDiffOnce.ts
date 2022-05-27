/**
 * simple string match to find the very first difference between two pieces of text
 * @param   {string}  str1  the 1st string
 * @param   {string}  str2  the 2nd string
 * 
 * @returns {any[]} An array of object which contains the entire string match so far and the 1st difference between the strings
*/
export default (str1: string, str2: string) => {
  const diff = new Map();
  for (let idx = 0; idx < str1.length; idx += 1) {
    if (!diff.has('line')) diff.set('line', { character: '', diff: { str1: null, str2: null }, containsDiff: false });

    if (str1[idx] !== str2[idx]) {
      diff.get('line').containsDiff = true;
      diff.get('line').diff = {
        str1: str1[idx],
        str2: str2[idx],
        atIdx: idx,
      };
      break;
    }
    if (str1[idx] === str2[idx]) diff.get('line').character += str1[idx];
  }
  return Array.from(diff)[0][1];
};
