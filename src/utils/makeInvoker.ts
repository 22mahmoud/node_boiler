import assert from 'node:assert';
import { FunctionReturning, ResolverOptions, asFunction } from 'awilix';
import { Request, Response, NextFunction } from 'express';

import { asyncErrorWrapper } from './asyncErrorWrapper';

export function makeInvoker<T>(fn: FunctionReturning<T>, opts?: ResolverOptions<T>) {
  const resolver = asFunction(fn, opts);

  return <K extends keyof T>(method: K) =>
    (req: Request, res: Response, next: NextFunction) => {
      const container = req.container;
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

      return asyncErrorWrapper(resolved[method].bind(resolved))(req, res, next);
    };
}
