import { RESOLVER } from 'awilix';
import { Router } from 'express';

import { createPostsController } from './postsController';

import type { Config } from '../../utils/config';
import type { Logger } from 'pino';
import type { Db } from 'mongodb';
import type { PostsService } from './postsService';

export type CreateRouter = (ctx: {
  config: Config;
  logger: Logger;
  db: Db;
  postsService: PostsService;
}) => Router;

export const createPostsRouter: CreateRouter = ({ postsService, logger }) => {
  const router = Router();

  const postsController = createPostsController({ postsService });

  router
    .get('/posts', postsController.list)
    .post('/posts', postsController.create)
    .get('/posts/:id', postsController.get),
    logger.info('`/posts` routes created');

  return router;
};

// @ts-ignore
createPostsRouter[RESOLVER] = {
  name: 'postsRouter',
};

export type PostsRouter = ReturnType<typeof createPostsRouter>;
