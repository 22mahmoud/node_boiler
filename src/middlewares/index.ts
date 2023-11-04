import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { errorMiddleware } from './errorMiddleware';

import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { Config } from '../utils/config';
import type { Logger } from 'pino';

export type CreateMiddlewares = (ctx: { config: Config; logger: Logger }) => {
  pre: RequestHandler[] | ErrorRequestHandler[];
  post: RequestHandler[] | ErrorRequestHandler[];
};

export const createMiddlewares: CreateMiddlewares = ({ config, logger }) => {
  const pre: RequestHandler[] | ErrorRequestHandler[] = [
    pinoHttp({
      logger,
      customLogLevel: (_req, res) => (res.statusCode >= 500 ? 'error' : 'info'),
    }) as RequestHandler,

    helmet(),

    cors({ origin: '*', allowedHeaders: ['Authorization', 'Content-Type'] }),

    express.json(),

    express.urlencoded({ extended: true }),
  ];

  const post: RequestHandler[] | ErrorRequestHandler[] = [errorMiddleware({ config })];

  return { post, pre };
};
