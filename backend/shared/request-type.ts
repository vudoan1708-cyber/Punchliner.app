import type { RequestHandler } from "express";

type RequestHandlerWithType<
  RequestBody = any,
  RequestQuery = any,
  RequestParam = any
> = RequestHandler<RequestParam, any, RequestBody, RequestQuery>;

type PaginationOption = {
  page?: number;
  pageSize?: number;
};

export type { RequestHandlerWithType, PaginationOption };
