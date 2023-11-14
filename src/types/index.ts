import type { Db, MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import type { Express } from 'express';
import type { CreateApp } from '@/app';
import type { PostsController, PostsDAL, PostsRouter, PostsService } from '@/features';
import type { CreateApplicationError, CreateRedisClient, CreateSentry, HttpStatus } from '@/lib';
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
  app: Express;
  createApp: CreateApp;
  error: CreateApplicationError;
  redisClient: CreateRedisClient;
  sentry: CreateSentry;

  postsDAL: PostsDAL;
  postsRouter: PostsRouter;
  postsService: PostsService;
  postsController: PostsController;
}

export {
  Db,
  MongoClient,
  HttpStatus,
  Logger,
  Config,
  Terminator,
  Middlewares,
  CreateApp,
  PostsDAL,
  PostsRouter,
  PostsService,
  PostsController,
  Route,
  EnvSchemaType,
  CreateApplicationError,
  CreateSentry,
  CreateRedisClient,
};
