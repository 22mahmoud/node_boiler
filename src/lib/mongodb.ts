import { MongoClient } from 'mongodb';

import type { Config, Logger } from '@/types';

export type CreateMongoClient = (ctx: { config: Config; logger: Logger }) => MongoClient;

export const createMongoClient: CreateMongoClient = ({ config, logger }) => {
  const client = new MongoClient(config.mongoUri, {
    monitorCommands: true,
  });

  client.on('commandStarted', (event) => logger.debug(event));
  client.on('commandSucceeded', (event) => logger.debug(event));
  client.on('commandFailed', (event) => logger.error(event));

  client.on('serverOpening', () => {
    logger.bootstrap('MongoDb default connection connected');
  });

  client.on('error', (error) => {
    logger.error('MongoDb default connection error ', error);
    process.exit(1);
  });

  return client;
};

export const getDb = ({ dbClient, config }: { dbClient: MongoClient; config: Config }) =>
  dbClient.db(config.dbName);
