/**
 * Insert an item to an array at a specified index, no bounding indices taken into account
 * e.g.
 * insert([1, 2], 1, 10) // [1, 10, 2]
 *
 * @param   {any[]}  array  the array to be modified
 * @param   {any}  index   the index whereby the array will be modified at (no bounding indices allowed)
 * @param   {any}  newItem  the new item to be inserted in the array
 *
 * @return  {any[]}  array with no duplicate
 */
export default (array: Array<any>, index: number, newItem: any): Array<any> => {
  array.splice(index, 1);
  return [
    // part of the array before the specified index
    ...array.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...array.slice(index)
  ];
};
