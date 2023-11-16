import type { AwilixContainer } from 'awilix';
import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { MongoClient } from 'mongodb';
import type { Logger, RedisClient, Sentry } from '@/types';

interface Deps {
  logger: Logger;
  dbClient: MongoClient;
  container: AwilixContainer;
  redisClient: RedisClient;
  sentry: Sentry;
}

export type Terminator = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) => (signal: NodeJS.Signals) => void;

export const terminator: (deps: Deps) => Terminator =
  ({ dbClient, logger, container, redisClient, sentry }) =>
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
          logger.info('All dependencies disposed');
        })
        .catch((error) => {
          logger.error('Error while container.dispose()', error);
          throw error;
        });

    const closeRedisConnection = () =>
      redisClient
        .quit()
        .then(() => {
          logger.info('Closed Redis Client connection');
        })
        .catch((error) => {
          logger.error('Error while closing redis client', error);
          throw error;
        });

    const closeSentry = () =>
      sentry
        .close()
        .then(() => {
          logger.info('Closed Sentry');
        })
        .catch((error) => {
          logger.error('Error while closing Sentry', error);
          throw error;
        });

    return async (signal) => {
      logger.info(`Got ${signal}. Graceful shutdown start`);

      if (server.closeIdleConnections) server.closeIdleConnections();

      try {
        await closeServer();
        await closeMongoConnection();
        await closeRedisConnection();
        await closeSentry();
        await diposeContainer();

        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    };
  };
