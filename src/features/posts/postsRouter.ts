import { createPostBodySchema } from './postsSchema';

import type { ContainerRegister, Route } from '@/types';

export const createPostsRouter = ({ postsController }: ContainerRegister): Route[] => [
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
      body: createPostBodySchema,
    },
  },
  {
    method: 'delete',
    path: '/posts/:id',
    handlers: [postsController.delete],
  },
];

export type PostsRouter = ReturnType<typeof createPostsRouter>;
