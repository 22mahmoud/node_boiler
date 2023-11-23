import type { Db, MongoClient } from 'mongodb';
import type { Express } from 'express';
import type { App } from '@/app';
import type {
  PostsController,
  PostsDAL,
  PostsDTO,
  PostsDTOFactory,
  PostsModel,
  PostsRouter,
  PostsService,
} from '@/features';
import type { ApplicationError, HttpStatus, Logger, RedisClient, Sentry } from '@/lib';
import type { Middlewares } from '@/middlewares';
import type { Config, EnvSchemaType, Terminator } from '@/utils';
import type { Route } from './routes';

export type NODE_ENV = 'production' | 'development' | 'test';

export interface Deps {
  config: Config;
  logger: Logger;
  dbClient: MongoClient;
  db: Db;
  env: EnvSchemaType;
  middlewares: Middlewares;
  terminator: Terminator;
  app: Express;
  createApp: App;
  error: ApplicationError;
  redisClient: RedisClient;
  sentry: Sentry;

  postsDAL: PostsDAL;
  postsRouter: PostsRouter;
  postsService: PostsService;
  postsController: PostsController;
  postsDto: PostsDTOFactory;
}

export {
  Db,
  MongoClient,
  HttpStatus,
  Logger,
  Config,
  Terminator,
  Middlewares,
  App,
  PostsDAL,
  PostsRouter,
  PostsService,
  PostsController,
  Route,
  EnvSchemaType,
  ApplicationError,
  Sentry,
  RedisClient,
  PostsDTO,
  PostsDTOFactory,
  PostsModel,
};
