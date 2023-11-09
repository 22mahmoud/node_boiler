import type { AwilixContainer } from 'awilix';
import type { ContainerRegister } from '../@types';
import type { EnvSchemaType } from '../utils/envSchema';

declare module 'http' {
  interface IncomingMessage {
    container: AwilixContainer<ContainerRegister>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}
