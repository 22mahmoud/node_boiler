import type { AwilixContainer } from 'awilix';
import type { ContainerRegister, EnvSchemaType } from '@/types';

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