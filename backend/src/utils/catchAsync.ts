import { Request, Response, NextFunction } from "express";

export const catchAsync =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  message = "Operation timed out"
): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);