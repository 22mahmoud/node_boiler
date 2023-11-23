import http from 'node:http';
import express, { Router } from 'express';
import { map } from 'ramda';

import { zodMiddleware } from '@/middlewares/zodMiddleware';
import { asyncErrorWrapper } from '@/utils';

import type { MongoClient } from 'mongodb';
import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import type { Logger, Route } from '@/types';
import type { Config } from '@/utils';

const LONGEST_METHOD_CHARS = 7; // app.options(..)

export type Deps = {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  middlewares?: {
    pre?: RequestHandler[] | ErrorRequestHandler[];
    post?: RequestHandler[] | ErrorRequestHandler[];
  };
  routes: Route[];
  app: Express;
};

const createUseMiddlewares =
  ({ app }: { app: Express; logger: Logger }) =>
  (middlewares: RequestHandler[] | ErrorRequestHandler[] = []) => {
    middlewares.forEach((handler) => {
      app.use(handler);
    });
  };

const createUseApiRoutes =
  ({ app, logger }: { app: Express; logger: Logger }) =>
  (routes: Route[] = []) => {
    const router = Router();

    routes.forEach(({ handlers, method, path, schema }) => {
      if (!(method in router)) {
        return;
      }

      router.use(
        '/api/v1',

        // eslint-disable-next-line security/detect-object-injection
        router[method](
          path,
          zodMiddleware(schema ?? {}),
          ...map(asyncErrorWrapper, handlers as any[]),
        ),
      );

      logger.bootstrap(
        ':%s%s  %s',
        method.toUpperCase(),
        Array(LONGEST_METHOD_CHARS - method.length)
          .fill(' ')
          .join(''),
        path,
      );
    });

    app.use(router);
  };

export const createExpress = () => {
  return express();
};

export const createApp =
  ({ middlewares, routes, config, logger, app }: Deps) =>
  () => {
    const useMiddlewares = createUseMiddlewares({ app, logger });
    const useApiRoutes = createUseApiRoutes({ app, logger });

    useMiddlewares(middlewares?.pre);

    logger.bootstrap(' - - - <ROUTES>  - - - - ');
    useApiRoutes(routes);
    logger.bootstrap(' - - - </ROUTES> - - - - ');

    useMiddlewares(middlewares?.post);

    const server = http.createServer(app);

    const listen = () => {
      server.listen(config.port, () => {
        logger.info(`Server is running on port ${config.port}`);
      });
    };

    return { server, listen };
  };

export type App = ReturnType<typeof createApp>;
