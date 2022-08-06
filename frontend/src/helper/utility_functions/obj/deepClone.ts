/**
 * Deep Clone an object
 *
 * e.g.1
 * deepClone()
 * // null
 *
 * e.g.2
 * const obj1 = {name: 'Vu Doan', age: 100, address: { city: Leeds, country: UK, }}
 *
 * const obj2 = deepClone(obj1)
 *
 * obj2.name = 'Vu Handsome'
 *
 * obj2.address.city = 'London'
 *
 * // obj1 = {name: 'Vu Doan', age: 100, address: { city: Leeds, country: UK, }}
 *
 * // obj2 = {name: 'Vu Handsome', age: 100, address: { city: London, country: UK, }}
 *
 *
 ** @param   {object}  obj  the object to deep clone / copy
 *
 ** @return  {object}  a complete copy of that object
 */
 export default (obj: any): any|null => {
  if (!!obj) {
    try {
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
      return structuredClone(obj);
    // If a browser doesn't support the function, use JSON to deep clone the passed object
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  }
  return null;
};
