import http from 'node:http';
import express, { Router } from 'express';
import { map } from 'ramda';

import { zodMiddleware } from '@/middlewares/zodMiddleware';
import { asyncErrorWrapper } from '@/utils';

import type { MongoClient } from 'mongodb';
import type { Server } from 'node:http';
import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import type { Logger, Route } from '@/types';
import type { Config } from '@/utils';

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
  (app: Express) =>
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

      logger.bootstrap(':%s "%s" route initialized!', method.toUpperCase(), path);
    });

    app.use(router);
  };

export const createExpress = () => {
  return express();
};

export const createApp =
  ({ middlewares, routes, config, logger, app }: Deps) =>
  (): Promise<{ server: Server; listen: () => void }> =>
    new Promise((resolve) => {
      const useMiddlewares = createUseMiddlewares(app);
      const useApiRoutes = createUseApiRoutes({ app, logger });

      useMiddlewares(middlewares?.pre);
      useApiRoutes(routes);
      useMiddlewares(middlewares?.post);

      const server = http.createServer(app);

      const listen = () => {
        server.listen(config.port, () => {
          logger.bootstrap(`Server is running on port ${config.port}`);
        });
      };

      resolve({ server, listen });
    });

export type CreateApp = ReturnType<typeof createApp>;
