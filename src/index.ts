import { createContainer } from '@/ioc';

const container = createContainer();

const { app, dbClient, terminator, redisClient } = container.cradle;

app().then(async ({ server, listen }) => {
  await Promise.all([dbClient.connect(), redisClient.connect()]);

  listen();

  process.on('SIGINT', terminator(server)).on('SIGTERM', terminator(server));
});
