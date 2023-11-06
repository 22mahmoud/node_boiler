import { RESOLVER } from 'awilix';
import { Router } from 'express';

import type { Logger } from 'pino';
import { createPostsController } from './postsController';
import { makeInvoker } from '../../utils/makeInvoker';

export type CreateRouter = (ctx: { logger: Logger }) => Router;

export const createPostsRouter: CreateRouter = ({ logger }) => {
  const router = Router();

  const api = makeInvoker(createPostsController);

  router
    .get('/posts', api('list'))
    .post('/posts', api('create'))
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
