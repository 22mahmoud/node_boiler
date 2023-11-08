import assert from 'node:assert';
import {
  AwilixContainer,
  ClassOrFunctionReturning,
  FunctionReturning,
  Resolver,
  ResolverOptions,
  asFunction,
} from 'awilix';
import { Request, Response, NextFunction } from 'express';

import { asyncErrorWrapper } from './asyncErrorWrapper';
import { ContainerRegister } from '../@types';

export function makeInvoker<T>(fn: FunctionReturning<T>, opts?: ResolverOptions<T>) {
  const resolver = asFunction(fn, opts);

  return <K extends keyof T>(method: K) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const container: AwilixContainer<ContainerRegister> = req.container;
      const resolved: any = container.build(resolver);

      assert(
        method,
        `methodToInvoke must be a valid method type, such as string, number or symbol, but was ${method.toString()}`,
      );

      if (!resolved[method]) {
        throw Error(
          `The method attempting to be invoked, '${method.toString()}', does not exist on the controller`,
        );
      }

      return asyncErrorWrapper(await resolved[method].bind(resolved))(req, res, next);
    };
}

export function inject(factory: ClassOrFunctionReturning<any> | Resolver<any>) {
  const resolver = typeof factory === 'function' ? asFunction(factory as any) : factory;

  return async (req: Request, res: Response, next: NextFunction) => {
    const container: AwilixContainer<ContainerRegister> = req.container;
    const resolved: any = container.build(resolver);

    return asyncErrorWrapper(await resolved)(req, res, next);
  };
}
