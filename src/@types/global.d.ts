import type { AwilixContainer } from 'awilix';
import type { ContainerRegister } from '../@types';

declare module 'http' {
  interface IncomingMessage {
    container: AwilixContainer<ContainerRegister>;
  }
}
