import { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncErrorWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => RequestHandler;

export const asyncErrorWrapper: AsyncErrorWrapper = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
