import { RESOLVER } from 'awilix';
import pino from 'pino';
import { ecsFormat } from '@elastic/ecs-pino-format';

import type { Config } from '../utils/config';
import type { TransportTargetOptions } from 'pino';

export const createLogger = ({ config }: { config: Config }) => {
  const level = 'trace';

  const ecsOptions = ecsFormat({
    convertReqRes: true,
    serviceEnvironment: config.nodeEnv,
    serviceName: 'node_boiler',
  });

  const logFileTransport: TransportTargetOptions = {
    level,
    target: 'pino/file',
    options: { destination: './.logs/out.log' },
  };

  const prettyTransport: TransportTargetOptions = {
    level,
    target: 'pino-pretty',
    options: {
      timestampKey: '@timestamp',
      messageKey: 'message',
      colorize: true,
      translateTime: 'SYS:dd-mm-yyyy hh:MM:ss TT',
      singleLine: true,
      ignore: [
        'process\\.pid',
        'host\\.hostname',
        'ecs\\.version',
        'service\\.name',
        'service\\.environment',
        'event\\.dataset',
        'log\\.level',
      ].join(','),
    },
  };

  const elasticsearchTransport: TransportTargetOptions = {
    level,
    target: 'pino-elasticsearch',
    options: {
      index: 'logs-node_boiler',
      node: config.elasticsearchUrl,
      auth: {
        apiKey: config.elasticsearchApiKey,
      },
    },
  };

  const logger = pino(
    {
      level,
      ...ecsOptions,
      formatters: {
        ...ecsOptions.formatters,
        level(label, number) {
          return {
            level: number,
            'log.level': label,
          };
        },
      },
    },
    pino.transport({
      targets: [
        logFileTransport,
        ...(config.elasticsearchUrl ? [elasticsearchTransport] : []),
        ...(config.isDev ? [prettyTransport] : []),
      ],
    }),
  );

  return logger;
};

// @ts-ignore
createLogger[RESOLVER] = { name: 'logger' };
