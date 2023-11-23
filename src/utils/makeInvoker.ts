import assert from 'node:assert';
import { NextFunction, Request, Response } from 'express';
import {
  asFunction,
  AwilixContainer,
  ClassOrFunctionReturning,
  FunctionReturning,
  Resolver,
  ResolverOptions,
} from 'awilix';

import { asyncErrorWrapper } from './asyncErrorWrapper';

import type { Deps } from '@/types';

export function makeInvoker<T>(fn: FunctionReturning<T>, opts?: ResolverOptions<T>) {
  const resolver = asFunction(fn, opts);

  return <K extends keyof T>(method: K) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const container: AwilixContainer<Deps> = req.container;
      const resolved: Record<K, any> = container.build(resolver);

      assert(
        method,
        `methodToInvoke must be a valid method type, such as string, number or symbol, but was ${method.toString()}`,
      );

      if (!Object.hasOwn(resolved, method)) {
        throw Error(
          `The method attempting to be invoked, '${method.toString()}', does not exist on the controller`,
        );
      }

      // eslint-disable-next-line security/detect-object-injection
      return asyncErrorWrapper(await resolved[method].bind(resolved))(req, res, next);
    };
}

export function inject(factory: ClassOrFunctionReturning<any> | Resolver<any>) {
  const resolver = typeof factory === 'function' ? asFunction(factory as any) : factory;

  return async (req: Request, res: Response, next: NextFunction) => {
    const container: AwilixContainer<Deps> = req.container;
    const resolved: any = container.build(resolver);

    return asyncErrorWrapper(await resolved)(req, res, next);
  };
}
