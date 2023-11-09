import { container } from './ioc';

const { app, dbClient, terminator } = container.cradle;

app().then(async ({ server, listen }) => {
  await dbClient.connect();

  listen();

  process.on('SIGINT', terminator(server));
  process.on('SIGTERM', terminator(server));
});
