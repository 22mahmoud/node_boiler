import { RESOLVER } from 'awilix';
import { Router } from 'express';

import type { Logger } from 'pino';
import type { PostsController } from './postsController';

export type CreateRouter = (ctx: {
  logger: Logger;
  postsController: PostsController;
}) => Router;

export const createPostsRouter: CreateRouter = ({ logger, postsController }) => {
  const router = Router();

  router
    .get('/posts', postsController.list)
    .post('/posts', postsController.create)
    .get('/posts/:id', postsController.get)
    .delete('/posts/:id', postsController.delete);

  logger.info('`/posts` routes created');

  return router;
};

// @ts-ignore
createPostsRouter[RESOLVER] = {
  name: 'postsRouter',
};

export type PostsRouter = ReturnType<typeof createPostsRouter>;
