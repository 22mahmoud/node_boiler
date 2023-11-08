import { NextFunction, Request, Response } from 'express';

import type { ZodObject } from 'zod';

export const zodMiddleware =
  <T extends ZodObject<{ body?: ZodObject<any>; query?: ZodObject<any>; params?: ZodObject<any> }>>(
    schema: T,
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    return schema
      .parseAsync(data)
      .then(() => next())
      .catch(next);
  };
