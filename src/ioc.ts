import { createContainer, asFunction, InjectionMode, AwilixContainer } from 'awilix';

import { ContainerRegister } from './@types';
import { createApp } from './app';
import { createConfig } from './utils/config';
import { createLogger } from './lib/pino';
import { createMongoClient, getDb } from './lib/mongodb';
import { createMiddlewares } from './middlewares';
import { createPostsDAL } from './features/posts/postsDAL';
import { createPostsRouter } from './features/posts/postsRouter';
import { createPostsService } from './features/posts/postsService';
import { terminator } from './utils/terminator';

export const container = createContainer<ContainerRegister>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  config: asFunction(createConfig)
    .singleton()
    .inject(() => ({ env: process.env })),
  logger: asFunction(createLogger).singleton(),

  dbClient: asFunction(createMongoClient).singleton(),
  db: asFunction(getDb).singleton(),

  middlewares: asFunction(createMiddlewares)
    .singleton()
    .inject((container) => ({ container })),

  terminator: asFunction(terminator)
    .singleton()
    .inject((container) => ({ container })),

  // routers
  postsRouter: asFunction(createPostsRouter).singleton(),

  // services
  postsService: asFunction(createPostsService).scoped(),

  // DALs
  postsDAL: asFunction(createPostsDAL).scoped(),

  app: asFunction(createApp)
    .singleton()
    .inject(() => {
      const c = container.cradle as AwilixContainer<ContainerRegister>['cradle'];

      return {
        routes: Object.keys(c)
          .filter((key) => key.endsWith('Router'))
          .map((key) => c[key as keyof typeof c]),
      };
    }),
});
