import { createContainer, asFunction, InjectionMode, Lifetime } from 'awilix';

import { createApp } from './app';
import { createLogger } from './lib/pino';
import { createMongoClient, getDb } from './lib/mongodb';
import { createConfig } from './utils/config';
import { terminator } from './utils/terminator';
import { createMiddlewares } from './middlewares';
import { ContainerRegister } from './@types';

const container = createContainer<ContainerRegister>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  config: asFunction(createConfig, { injector: () => ({ env: process.env as any }) }).singleton(),
  logger: asFunction(createLogger).singleton(),
  dbClient: asFunction(createMongoClient).singleton(),
  db: asFunction(getDb).singleton(),
  middlewares: asFunction(createMiddlewares).singleton(),
  terminator: asFunction(terminator, { injector: (container) => ({ container }) }).singleton(),
  app: asFunction(createApp, {
    injector: (container) => ({
      // @ts-ignore
      routes: [container.cradle.postsRouter],
    }),
  }).singleton(),
});

container.loadModules(['./**/*Service.*', './**/*DAL.*', './**/*Router.*'], {
  formatName: (_name, descriptor) => {
    return descriptor?.path.split?.('/')?.slice?.(-1)?.[0]?.split?.('.ts')?.[0];
  },
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    register: asFunction,
  },
});

container.cradle.app().then(async ({ server, listen }) => {
  await container.cradle.dbClient.connect();

  listen();

  const terminate = container.cradle.terminator;

  process.on('SIGINT', terminate(server));
  process.on('SIGTERM', terminate(server));
});
