import type { MongoClient } from 'mongodb';
import type { Logger } from 'pino';
import type { IncomingMessage, Server, ServerResponse } from 'http';

interface Deps {
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  logger: Logger;
  dbClient: MongoClient;
}

export type Terminator = (signal: NodeJS.Signals) => void;

export const terminator: (deps: Deps) => Terminator = ({ dbClient, logger, server }) => {
  const closeServer = () =>
    new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
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

  return async (signal) => {
    logger.info(`Got ${signal}. Graceful shutdown start`);

    if (server.closeIdleConnections) server.closeIdleConnections();

    try {
      await closeServer();
      await closeMongoConnection();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  };
};
