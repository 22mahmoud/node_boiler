import { NextFunction, Request, Response } from 'express';

import type { ZodError, ZodSchema } from 'zod';

export const zodMiddleware =
  (schema: Partial<{ body: ZodSchema; headers: ZodSchema; query: ZodSchema; params: ZodSchema }>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const errors: ZodError<any>[] = [];

    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        errors.push(result.error);
      }
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        errors.push(result.error);
      }
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        errors.push(result.error);
      }
    }

    if (schema.headers) {
      const result = schema.headers.safeParse(req.headers);
      if (!result.success) {
        errors.push(result.error);
      }
    }

    if (errors.length > 0) {
      return next({ status: 402, errors });
    }

    next();
  };
