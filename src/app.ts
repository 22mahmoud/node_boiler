import http from 'node:http';
import express, { Router } from 'express';

import { zodMiddleware } from '@/middlewares/zodMiddleware';

import type { MongoClient } from 'mongodb';
import type { Server } from 'node:http';
import type { Logger } from 'pino';
import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import type { Route } from '@/types';
import type { Config } from '@/utils';

export type CreateApp = (ctx: {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  middlewares?: {
    pre?: RequestHandler[] | ErrorRequestHandler[];
    post?: RequestHandler[] | ErrorRequestHandler[];
  };
  routes: Route[];
}) => () => Promise<{ server: Server; listen: () => void }>;

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

      // eslint-disable-next-line security/detect-object-injection
      router.use('/api/v1', router[method](path, zodMiddleware(schema ?? {}), ...handlers));

      logger.info(':%s "%s" route initialized!', method.toUpperCase(), path);
    });

    app.use(router);
  };

export const createApp: CreateApp =
  ({ middlewares, routes, config, logger }) =>
  () =>
    new Promise((resolve) => {
      const app = express();
      const useMiddlewares = createUseMiddlewares(app);
      const useApiRoutes = createUseApiRoutes({ app, logger });

      useMiddlewares(middlewares?.pre);
      useApiRoutes(routes);
      useMiddlewares(middlewares?.post);

      const server = http.createServer(app);

      const listen = () => {
        server.listen(config.port, () => {
          logger.info(`Server is running on port ${config.port}`);
        });
      };

      resolve({ server, listen });
    });

export type App = ReturnType<typeof createApp>;
