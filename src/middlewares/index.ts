import { type AwilixContainer, RESOLVER } from 'awilix';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { registerLoggerMiddleware, scopedContainerMiddleware } from './scopedContainerMiddleware';
import { errorMiddleware } from './errorMiddleware';

import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { Config } from '../utils/config';
import type { Logger } from 'pino';
import type { ContainerRegister } from '../@types';

export type CreateMiddlewares = (ctx: {
  config: Config;
  logger: Logger;
  container: AwilixContainer<ContainerRegister>;
}) => {
  pre: RequestHandler[] | ErrorRequestHandler[];
  post: RequestHandler[] | ErrorRequestHandler[];
};

export const createMiddlewares: CreateMiddlewares = ({ container, config, logger }) => {
  const pre: RequestHandler[] | ErrorRequestHandler[] = [
    scopedContainerMiddleware({ container }),

    pinoHttp({
      logger,
      customLogLevel: (_req, res) => (res.statusCode >= 500 ? 'error' : 'info'),
    }) as RequestHandler,

    registerLoggerMiddleware(),

    helmet(),

    cors({ origin: '*', allowedHeaders: ['Authorization', 'Content-Type'] }),

    express.json(),

    express.urlencoded({ extended: true }),
  ];

  const post: RequestHandler[] | ErrorRequestHandler[] = [errorMiddleware({ config })];

  return { post, pre };
};

export type Middlewares = ReturnType<typeof createMiddlewares>;

// @ts-ignore
createMiddlewares[RESOLVER] = { name: 'middlewares' };
