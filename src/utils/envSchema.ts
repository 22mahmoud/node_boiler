import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.number().default(5000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    ELASTICSEARCH_URL: z.string().url().optional(),
    ELASTICSEARCH_API_KEY: z.string().optional(),

    MONGO_URI: z.string().trim().url(),
    DB_NAME: z.string().trim(),

    REDIS_URI: z.string().trim().url(),

    SENTRY_DSN: z.string().trim().url(),
  })
  .refine((values) => !values.ELASTICSEARCH_URL?.length, {
    message: 'ELASTICSEARCH_API_KEY is required if ELASTICSEARCH_URL exists',
    path: ['ELASTICSEARCH_API_KEY'],
  });

export const createEnvSchema = ({ env }: { env: any }) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error('There is an error with the server environment variables');
    console.error(result.error.issues);
    process.exit(1);
  }

  return result.data;
};

export type EnvSchemaType = z.infer<typeof envSchema>;
