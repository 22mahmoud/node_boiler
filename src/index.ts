import { createContainer } from '@/ioc';

const container = createContainer();

const { createApp, dbClient, terminator, redisClient } = container.cradle;

createApp().then(async ({ server, listen }) => {
  await Promise.all([dbClient.connect(), redisClient.connect()]);

  listen();

  process.on('SIGINT', terminator(server)).on('SIGTERM', terminator(server));
});
