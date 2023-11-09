import { createContainer, asFunction, InjectionMode, AwilixContainer } from 'awilix';

import { ContainerRegister } from './@types';
import { createApp } from './app';
import { createConfig } from './utils/config';
import { createLogger } from './lib/pino';
import { createMongoClient, getDb } from './lib/mongodb';
import { createMiddlewares } from './middlewares';
import { terminator } from './utils/terminator';
import { createEnvSchema } from './utils/envSchema';
import { resolvePostsDiConfig } from './features/posts/postsDiConfig';

export const container = createContainer<ContainerRegister>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  env: asFunction(createEnvSchema)
    .singleton()
    .inject(() => ({ env: process.env })),

  config: asFunction(createConfig)
    .singleton()
    .inject((container) => ({ env: (container.cradle as any).env })),

  logger: asFunction(createLogger).singleton(),

  dbClient: asFunction(createMongoClient).singleton(),
  db: asFunction(getDb).singleton(),

  middlewares: asFunction(createMiddlewares)
    .singleton()
    .inject((container) => ({ container })),

  terminator: asFunction(terminator)
    .singleton()
    .inject((container) => ({ container })),

  ...resolvePostsDiConfig(),

  app: asFunction(createApp)
    .singleton()
    .inject(() => {
      const c = container.cradle as AwilixContainer<ContainerRegister>['cradle'];

      return {
        routes: Object.keys(c)
          .filter((key) => key.endsWith('Router'))
          .map((key) => c[key as keyof typeof c])
          .flat(1),
      };
    }),
});
