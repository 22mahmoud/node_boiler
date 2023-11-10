import type { RouteParameters } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { ZodSchema } from 'zod';
import type { RequestHandler } from 'express';

export type Route<
  Path extends string = any,
  P = RouteParameters<Path>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = {
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
  path: Path;
  handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>;
  schema?: Partial<{
    body: ZodSchema;
    query: ZodSchema;
    params: ZodSchema;
    headers: ZodSchema;
  }>;
};
