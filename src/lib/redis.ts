import { createClient } from 'redis';

import type { Config, Logger } from '@/types';

type Deps = {
  logger: Logger;
  config: Config;
};

export const createRedisClient = ({ logger, config }: Deps) => {
  const client = createClient({ url: config.redisUri });

  client.on('connect', () => {
    logger.info(`Redis connected`);
  });

  client.on('reconnecting', (info) => {
    logger.info(`Redis reconnection attempt #${info.attempt}, delay ${info.delay} ms`);
  });

  client.on('error', (err) => {
    logger.error('Redis error', err);
  });

  return client;
};

export type CreateRedisClient = ReturnType<typeof createRedisClient>;
