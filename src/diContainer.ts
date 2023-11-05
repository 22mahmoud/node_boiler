import { createContainer, asFunction, InjectionMode, Lifetime, AwilixContainer } from 'awilix';

import { ContainerRegister } from './@types';

export const container = createContainer<ContainerRegister>({
  injectionMode: InjectionMode.PROXY,
});

container.loadModules(
  [
    ['src/utils/config.(j|t)s', { injector: () => ({ env: process.env }) }],
    'src/lib/pino.(j|t)s',
    'src/lib/mongodb.(j|t)s',
    'src/middlewares/index.(j|t)s',
    ['src/utils/terminator.(j|t)s', { injector: (container) => ({ container }) }],
    [
      'src/app.(j|t)s',
      {
        injector: (container) => {
          const c = container.cradle as AwilixContainer<ContainerRegister>['cradle'];

          return {
            routes: Object.keys(c)
              .filter((key) => key.endsWith('Router'))
              .map((key) => c[key as keyof typeof c]),
          };
        },
      },
    ],
    'src/**/*DAL.(j|t)s',
    'src/**/*Service.(j|t)s',
    'src/**/*Controller.(j|t)s',
    'src/**/*Router.(j|t)s',
  ],
  {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asFunction,
    },
  },
);
