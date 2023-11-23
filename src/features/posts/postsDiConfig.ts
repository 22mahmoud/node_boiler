import { asFunction, NameAndRegistrationPair } from 'awilix';

import { createPostsController } from './postsController';
import { createPostsDAL } from './postsDAL';
import { createPostsDTO } from './postsDto';
import { createPostsRouter } from './postsRouter';
import { createPostsService } from './postsService';

import type { Deps } from '@/types';

export const resolvePostsDiConfig: () => NameAndRegistrationPair<Deps> = () => ({
  postsRouter: asFunction(createPostsRouter).singleton(),
  postsService: asFunction(createPostsService).singleton(),
  postsDAL: asFunction(createPostsDAL).singleton(),
  postsController: asFunction(createPostsController).singleton(),
  postsDto: asFunction(createPostsDTO).singleton(),
});
