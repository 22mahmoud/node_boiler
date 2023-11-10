import { NextFunction, Request, Response } from 'express';

import type { ZodError, ZodSchema } from 'zod';

type Validators = {
  body: ZodSchema;
  headers: ZodSchema;
  query: ZodSchema;
  params: ZodSchema;
};

type Keys = keyof Validators;

export const zodMiddleware =
  (validators: Partial<Validators>) => (req: Request, _res: Response, next: NextFunction) => {
    const { badData } = req.container.cradle.error;

    const data: { key: Keys; value: any }[] = [
      { key: 'body', value: req.body },
      { key: 'params', value: req.params },
      { key: 'query', value: req.query },
      { key: 'headers', value: req.headers },
    ];

    const errors = data
      .map((item) => {
        const schema = validators[item.key];

        if (!schema) return null;

        const result = schema.safeParse(req.body);

        if (!result.success) {
          return { type: item.key, ...result.error };
        }

        req[item.key] = result.data;
      })
      .filter(Boolean) as ({ type: Keys } & ZodError<any>)[];

    if (!errors.length) {
      return next();
    }

    badData({
      data: errors.map((error) => ({ type: error.type, errors: error.issues })),
    });
  };
