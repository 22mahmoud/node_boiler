import { asValue, type AwilixContainer } from 'awilix';
import type { RequestHandler } from 'express';

export const scopedContainerMiddleware: ({
  container,
}: {
  container: AwilixContainer;
}) => RequestHandler =
  ({ container }) =>
  (req, _res, next) => {
    req.container = container.createScope();

    next();
  };

export const registerLoggerMiddleware: () => RequestHandler = () => (req, _res, next) => {
  req.container.register({ logger: asValue(req.log) });

  next();
};
