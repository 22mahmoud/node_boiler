import { createPostSchema } from './postsSchema';

import type { Deps, Route } from '@/types';

export const createPostsRouter = ({ postsController }: Deps): Route[] => [
  {
    method: 'get',
    path: '/posts',
    handlers: [postsController.list],
  },
  {
    method: 'get',
    path: '/posts/:id',
    handlers: [postsController.get],
  },
  {
    method: 'post',
    path: '/posts',
    handlers: [postsController.create],
    schema: {
      body: createPostSchema,
    },
  },
  {
    method: 'delete',
    path: '/posts/:id',
    handlers: [postsController.delete],
  },
];

export type PostsRouter = ReturnType<typeof createPostsRouter>;
