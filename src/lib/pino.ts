import { ecsFormat } from '@elastic/ecs-pino-format';
import pino from 'pino';

import type { TransportTargetOptions } from 'pino';
import type { Config } from '../utils/config';

const levels = {
  bootstrap: 5,
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
} as const;

export const createLogger = ({ config }: { config: Config }) => {
  const level = 'bootstrap';

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

  const logFileErrorTransport: TransportTargetOptions = {
    level: 'error',
    target: 'pino/file',
    options: { destination: './.logs/out-error.log' },
  };

  const prettyTransport: TransportTargetOptions = {
    level: 5 as any,
    target: 'pino-pretty',
    options: {
      timestampKey: '@timestamp',
      messageKey: 'message',
      colorize: true,
      translateTime: 'SYS:dd-mm-yyyy hh:MM:ss TT',
      singleLine: true,
      customLevels: levels,
      minimumLevel: 'bootstrap',
      customColors: [
        'bootstrap:magenta',
        'trace:gray',
        'debug:blue',
        'info:green',
        'warn:yellow',
        'error:red',
        'fetal:red',
      ].join(','),
      useOnlyCustomProps: true,
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
      customLevels: levels,
      useOnlyCustomLevels: true,
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
        logFileErrorTransport,
        ...(config.elasticsearchUrl ? [elasticsearchTransport] : []),
        ...(config.isDev ? [prettyTransport] : []),
      ],
    }),
  );

  return logger;
};

export type Logger = ReturnType<typeof createLogger>;
