import { createClient } from 'redis';

import type { Config, Logger } from '@/types';

type Deps = {
  logger: Logger;
  config: Config;
};

export const createRedisClient = ({ logger, config }: Deps) => {
  const client = createClient({ url: config.redisUri });

  client.on('connect', () => {
    logger.bootstrap(`Redis connected`);
  });

  client.on('reconnecting', () => {
    logger.info(`Redis reconnection attempt`);
  });

  client.on('error', (error) => {
    logger.error('Redis error', error);
  });

  return client;
};

export type RedisClient = ReturnType<typeof createRedisClient>;
