import type { RequestHandler } from 'express';
import type { RouteParameters } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { ZodSchema } from 'zod';

export type Route<
  Route extends string = any,
  P = RouteParameters<Route>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = {
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
  path: Route;
  handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>;
  schema?: Partial<{
    body: ZodSchema;
    query: ZodSchema;
    params: ZodSchema;
    headers: ZodSchema;
  }>;
};
