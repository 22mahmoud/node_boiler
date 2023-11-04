import { createLogger } from './lib/pino';
import { createMongoClient } from './lib/mongodb';
import { createConfig } from './utils/config';
import { terminator } from './utils/terminator';
import { createMiddlewares } from './middlewares';
import { createApp } from './app';

import { createPostsRouter } from './features/posts/postsRoutes';
import { createPostsDAL } from './features/posts/postsDAL';
import { createPostsService } from './features/posts/postsService';

const config = createConfig({ env: process.env as any });
const logger = createLogger({ config });
const dbClient = createMongoClient({ config, logger });
const db = dbClient.db('node_boiler');

const postsDAL = createPostsDAL({ config, db, logger });
const postsService = createPostsService({ postsDAL });
const postsRouter = createPostsRouter({ config, db, logger, postsService });

createApp({
  config,
  dbClient,
  logger,
  middlewares: createMiddlewares({ config, logger }),
  routes: [postsRouter],
}).then(async ({ server, listen }) => {
  await dbClient.connect();

  listen();

  const terminate = terminator({ server, dbClient, logger });

  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);
});
