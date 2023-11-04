import express from 'express';
import http from 'node:http';

import type { Express, RequestHandler, ErrorRequestHandler, Router } from 'express';
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
}) => Promise<{ server: Server; listen: () => void }>;

const createUseMiddlewares =
  (app: Express) =>
  (middlewares: RequestHandler[] | ErrorRequestHandler[] = []) => {
    middlewares.forEach((handler) => {
      app.use(handler);
    });
  };

export const createApp: CreateApp = async ({ middlewares, routes, config, logger }) => {
  const app = express();
  const useMiddlewares = createUseMiddlewares(app);

  useMiddlewares(middlewares?.pre);
  useMiddlewares(routes);
  useMiddlewares(middlewares?.post);

  const server = http.createServer(app);

  const listen = () => {
    server.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  };

  return { server, listen };
};
