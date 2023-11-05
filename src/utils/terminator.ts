import { RESOLVER } from 'awilix';

import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { AwilixContainer } from 'awilix';

interface Deps {
  logger: Logger;
  dbClient: MongoClient;
  container: AwilixContainer;
}

export type Terminator = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) => (signal: NodeJS.Signals) => void;

export const terminator: (deps: Deps) => Terminator =
  ({ dbClient, logger, container }) =>
  (server) => {
    const closeServer = () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            console.log(error);
            logger.error('Error while closing server', error);
            return reject(error);
          }

          logger.info('Server closed successfully');
          return resolve();
        });
      });

    const closeMongoConnection = () =>
      dbClient
        .close()
        .then(() => {
          logger.info('Closed MongoDB connection');
        })
        .catch((error) => {
          logger.error('Error while closing MongoDB connection', error);
          throw error;
        });

    const diposeContainer = () =>
      container
        .dispose()
        .then(() => {
          logger.info('container diposed');
        })
        .catch((error) => {
          logger.error('Error while container.dispose()', error);
          throw error;
        });

    return async (signal) => {
      logger.info(`Got ${signal}. Graceful shutdown start`);

      if (server.closeIdleConnections) server.closeIdleConnections();

      try {
        await closeServer();
        await closeMongoConnection();
        await diposeContainer();

        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    };
  };

// @ts-ignore
terminator[RESOLVER] = { name: 'terminator' };
