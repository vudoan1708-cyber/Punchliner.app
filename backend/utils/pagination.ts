export function paginate(pageNo = 1, pageSize = 10): number {
  const page = Math.max(1, pageNo);
  const offset = (page - 1) * pageSize;
  return offset;
}
