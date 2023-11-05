import { Router } from 'express';

import { createPostsController } from './postsController';

import type { Config } from '../../utils/config';
import type { Logger } from 'pino';
import type { Db } from 'mongodb';
import type { PostsService } from './postsService';
import { RESOLVER } from 'awilix';

export type CreateRouter = (ctx: {
  config: Config;
  logger: Logger;
  db: Db;
  postsService: PostsService;
}) => Router;

export const createPostsRouter: CreateRouter = ({ postsService, logger }) => {
  const router = Router();

  const postsController = createPostsController({ postsService });

  router.get('/posts', postsController.list);
  router.post('/posts', postsController.create);
  router.get('/posts/:id', postsController.get);

  logger.info('`/posts` routes created');

  return router;
};

// @ts-ignore
createPostsRouter[RESOLVER] = {};


export type PostsRouter = ReturnType<typeof createPostsRouter>;
