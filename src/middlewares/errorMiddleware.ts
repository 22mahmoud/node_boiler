import type { ErrorRequestHandler } from 'express';
import type { Config } from '@/types';

export const errorMiddleware: (ctx: { config: Config }) => ErrorRequestHandler =
  ({ config }) =>
  (error, req, res, next) => {
    if (!error) return next();

    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'something went wrong';

    req.log.error(error);

    res.status(statusCode).send({
      message,
      statusCode,
      data: error.data,
      stack: config.isDev ? error.stack : null,
    });
  };
