import type { ErrorRequestHandler } from 'express';
import type { Config } from '@/types';

export const errorMiddleware: (ctx: { config: Config }) => ErrorRequestHandler =
  ({ config }) =>
  (error, _req, res, next) => {
    if (!error) return next();

    const status = error.statusCode || error.status || 500;
    const message = error.message || 'something went wrong';

    res.status(status).json({
      message,
      status,
      stack: config.isDev ? error.stack : null,
    });
  };
