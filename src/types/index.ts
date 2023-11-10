import type { Db, MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import type { App } from '@/app';
import type { PostsController, PostsDAL, PostsRouter, PostsService } from '@/features';
import type { CreateApplicationError, HttpStatus } from '@/lib';
import type { Middlewares } from '@/middlewares';
import type { Config, EnvSchemaType, Terminator } from '@/utils';
import type { Route } from './routes';

export type NODE_ENV = 'production' | 'development' | 'test';

export interface ContainerRegister {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  db: Db;
  env: EnvSchemaType;
  middlewares: Middlewares;
  terminator: Terminator;
  app: App;
  error: CreateApplicationError;

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
  Route,
  EnvSchemaType,
  CreateApplicationError,
  HttpStatus,
};
