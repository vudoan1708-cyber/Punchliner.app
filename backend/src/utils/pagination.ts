import type { QueryOptions } from "mongoose";

export function paginate<T = any>(pageNo = 1, pageSize = 10): QueryOptions<T> {
  const page = Math.max(1, pageNo);
  const offset = (page - 1) * pageSize;
  return { skip: offset, limit: pageSize };
}
