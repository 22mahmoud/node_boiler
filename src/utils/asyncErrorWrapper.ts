import { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncErrorWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => any,
) => RequestHandler;

export const asyncErrorWrapper: AsyncErrorWrapper = (fn) => (req, res, next) => {
  const result = fn(req, res, next);

  if (result && 'catch' in result) {
    return result.catch(next);
  }

  return result;
};
