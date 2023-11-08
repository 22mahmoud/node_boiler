import { RESOLVER } from 'awilix';
import express, { Router } from 'express';
import http from 'node:http';

import type { Express, RequestHandler, ErrorRequestHandler } from 'express';
import type { Server } from 'node:http';
import type { Config } from './utils/config';
import type { Logger } from 'pino';
import type { MongoClient } from 'mongodb';

export type CreateApp = (ctx: {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  middlewares?: {
    pre?: RequestHandler[] | ErrorRequestHandler[];
    post?: RequestHandler[] | ErrorRequestHandler[];
  };
  routes: Router[];
}) => () => Promise<{ server: Server; listen: () => void }>;

const createUseMiddlewares =
  (app: Express) =>
  (middlewares: RequestHandler[] | ErrorRequestHandler[] = []) => {
    middlewares.forEach((handler) => {
      app.use(handler);
    });
  };

const createUseApiRoutes =
  (app: Express) =>
  (routes: RequestHandler[] = []) => {
    const router = Router();

    routes.forEach((handler) => {
      router.use('/api/v1', handler);
    });

    app.use(router);
  };

export const createApp: CreateApp =
  ({ middlewares, routes, config, logger }) =>
  () =>
    new Promise((resolve) => {
      const app = express();
      const useMiddlewares = createUseMiddlewares(app);
      const useApiRoutes = createUseApiRoutes(app);

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

// @ts-ignore
createApp[RESOLVER] = { name: 'app' };
