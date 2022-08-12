import type { RequestHandler } from "express";

type RequestHandlerWithType<RequestBody = any> = RequestHandler<
  any,
  any,
  RequestBody
>;

export type { RequestHandlerWithType };
