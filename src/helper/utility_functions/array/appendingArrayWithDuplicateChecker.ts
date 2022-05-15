/**
 * Check for duplicated item in an array
 * e.g.
 * appendingArrayWithDuplicateChecker([1,2], 2) // [1,2]
 * appendingArrayWithDuplicateChecker([1,2], 3) // [1,2,3]
 *
 * @param   {any[]}  array  the array in which to check for duplicate
 * @param   {any}  item   the item to check duplicate against with
 *
 * @return  {any[]}  array with no duplicate
 */
 export default (array: Array<any>, item: any): Array<any> => {
  const uniques: Set<any> = new Set(array);
  const isDuplicate: boolean = uniques.has(item);
  uniques.add(item);
  return [ Array.from(uniques), isDuplicate ];
};
