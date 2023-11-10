import { asFunction, NameAndRegistrationPair } from 'awilix';

import { createPostsController } from './postsController';
import { createPostsDAL } from './postsDAL';
import { createPostsRouter } from './postsRouter';
import { createPostsService } from './postsService';

import type { ContainerRegister } from '@/types';

export const resolvePostsDiConfig: () => NameAndRegistrationPair<ContainerRegister> = () => ({
  postsRouter: asFunction(createPostsRouter).singleton(),
  postsService: asFunction(createPostsService).singleton(),
  postsDAL: asFunction(createPostsDAL).singleton(),
  postsController: asFunction(createPostsController).singleton(),
});
