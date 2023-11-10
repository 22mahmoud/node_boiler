import { asFunction, createContainer, InjectionMode } from 'awilix';

import { createApp } from '@/app';
import { resolvePostsDiConfig } from '@/features';
import { createApplicationError, createLogger, createMongoClient, getDb } from '@/lib';
import { createMiddlewares } from '@/middlewares';
import { createConfig, createEnvSchema, terminator } from '@/utils';

import type { AwilixContainer } from 'awilix';
import type { ContainerRegister } from '@/types';

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

  error: asFunction(createApplicationError).singleton(),

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
