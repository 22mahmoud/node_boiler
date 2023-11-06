import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncErrorWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | any>,
) => RequestHandler;

export const asyncErrorWrapper: AsyncErrorWrapper = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);

    if (res.headersSent) return;

    if (!result) return res.status(204).send();

    return res.status(res.statusCode || 200).json(result);
  } catch (error) {
    next(error);
  }
};
