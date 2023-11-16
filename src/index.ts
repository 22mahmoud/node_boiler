import { createContainer } from '@/ioc';

const container = createContainer();

const { createApp, dbClient, terminator, redisClient } = container.cradle;

const { listen, server } = createApp();

const start = async () => {
  await Promise.all([dbClient.connect(), redisClient.connect()]);

  listen();
};

process.on('SIGINT', terminator(server)).on('SIGTERM', terminator(server));

start();
