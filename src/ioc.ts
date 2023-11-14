import { asFunction, createContainer as awilixCreateContainer, InjectionMode } from 'awilix';

import { createApp, createExpress } from '@/app';
import { resolvePostsDiConfig } from '@/features';
import {
  createApplicationError,
  createLogger,
  createMongoClient,
  createRedisClient,
  createSentry,
  getDb,
} from '@/lib';
import { createMiddlewares } from '@/middlewares';
import { createConfig, createEnvSchema, terminator } from '@/utils';

import type { AwilixContainer } from 'awilix';
import type { ContainerRegister } from '@/types';

export const createContainer = () => {
  const container = awilixCreateContainer<ContainerRegister>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    env: asFunction(createEnvSchema)
      .singleton()
      .inject(() => ({ env: process.env })),

    config: asFunction(createConfig).singleton(),

    logger: asFunction(createLogger).singleton(),

    dbClient: asFunction(createMongoClient).singleton(),
    db: asFunction(getDb).singleton(),

    redisClient: asFunction(createRedisClient).singleton(),

    error: asFunction(createApplicationError).singleton(),

    app: asFunction(createExpress).singleton(),

    sentry: asFunction(createSentry).singleton(),

    middlewares: asFunction(createMiddlewares)
      .singleton()
      .inject((container) => ({ container })),

    terminator: asFunction(terminator)
      .singleton()
      .inject((container) => ({ container })),

    ...resolvePostsDiConfig(),

    createApp: asFunction(createApp)
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

  return container;
};
