import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import type { Express } from 'express';
import type { Config, Logger } from '@/types';

type Deps = {
  logger: Logger;
  config: Config;
  app: Express;
};

export const createSentry = ({ config, app, logger }: Deps) => {
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    enabled: config.isProd,
  });

  logger.bootstrap('Sentry is initialised');

  return Sentry;
};

export type CreateSentry = ReturnType<typeof createSentry>;
