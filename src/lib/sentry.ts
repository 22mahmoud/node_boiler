import * as sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import type { Express } from 'express';
import type { Config, Logger } from '@/types';

type Deps = {
  logger: Logger;
  config: Config;
  app: Express;
};

export const createSentry = ({ config, app, logger }: Deps) => {
  sentry.init({
    dsn: config.sentryDsn,
    integrations: [
      new sentry.Integrations.Http({ tracing: true }),
      new sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    enabled: config.isProd,
  });

  logger.bootstrap('Sentry is initialised');

  return sentry;
};

export type Sentry = ReturnType<typeof createSentry>;
