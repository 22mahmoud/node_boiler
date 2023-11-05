import type { Logger } from 'pino';
import type { Config } from '../utils/config';
import type { Db, MongoClient } from 'mongodb';
import type { Terminator } from '../utils/terminator';
import type { Middlewares } from '../middlewares';
import type { App } from '../app';

import type { PostsDAL } from '../features/posts/postsDAL';
import type { PostsService } from '../features/posts/postsService';
import type { PostsRouter } from '../features/posts/postsRouter';
import type { PostsController } from '../features/posts/postsController';

export type NODE_ENV = 'production' | 'development' | 'test';

export interface ContainerRegister {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  db: Db;
  middlewares: Middlewares;
  terminator: Terminator;
  app: App;

  postsDAL: PostsDAL;
  postsRouter: PostsRouter;
  postsService: PostsService;
  postsController: PostsController;
}

export {
  Logger,
  Config,
  Db,
  MongoClient,
  Terminator,
  Middlewares,
  App,
  PostsDAL,
  PostsRouter,
  PostsService,
  PostsController,
};
