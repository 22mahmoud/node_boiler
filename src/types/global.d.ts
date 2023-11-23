import type { Deps, EnvSchemaType } from '@/types';

declare module 'http' {
  interface IncomingMessage {
    container: AwilixContainer<Deps>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}
