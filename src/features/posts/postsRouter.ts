import { RESOLVER } from 'awilix';
import { Router } from 'express';

import type { Logger } from 'pino';
import { createPostsController } from './postsController';
import { makeInvoker } from '../../utils/makeInvoker';
import { zodMiddleware } from '../../middlewares/zodMiddleware';
import { createPostSchema } from './postsSchema';

export type CreatePostsRouter = (ctx: { logger: Logger }) => Router;

export const createPostsRouter: CreatePostsRouter = ({ logger }) => {
  const router = Router();

  const api = makeInvoker(createPostsController);

  router
    .get('/posts', api('list'))
    .post('/posts', zodMiddleware(createPostSchema), api('create'))
    .get('/posts/:id', api('get'))
    .delete('/posts/:id', api('delete'));

  logger.info('`/posts` routes created');

  return router;
};

// @ts-ignore
createPostsRouter[RESOLVER] = {
  name: 'postsRouter',
};

export type PostsRouter = ReturnType<typeof createPostsRouter>;
