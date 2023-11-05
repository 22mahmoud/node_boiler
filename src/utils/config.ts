import { RESOLVER } from 'awilix';
import { NODE_ENV } from '../@types';

export const createConfig = ({
  env,
}: {
  env: {
    PORT: number;
    NODE_ENV: NODE_ENV;
    ELASTICSEARCH_URL: string;
    ELASTICSEARCH_API_KEY: string;
    MONGO_URI: string;
    DB_NAME: string;
  };
}) => {
  return {
    port: env.PORT ?? 5000,

    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',

    elasticsearchUrl: env.ELASTICSEARCH_URL,
    elasticsearchApiKey: env.ELASTICSEARCH_API_KEY,

    mongoUri: env.MONGO_URI ?? 'mongodb://localhost:27017',
    dbName: env.DB_NAME ?? 'node_boiler',
  };
};

// @ts-ignore
createConfig[RESOLVER] = {
  name: 'config',
};

export type Config = ReturnType<typeof createConfig>;
