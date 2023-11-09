import { EnvSchemaType } from './envSchema';

export const createConfig = ({ env }: { env: EnvSchemaType }) => {
  return {
    port: env.PORT ?? 5000,

    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',

    elasticsearchUrl: env.ELASTICSEARCH_URL,
    elasticsearchApiKey: env.ELASTICSEARCH_API_KEY,

    mongoUri: env.MONGO_URI,
    dbName: env.DB_NAME,
  };
};

export type Config = ReturnType<typeof createConfig>;
