import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const errors: Record<string, string[]> = {};

      for (const issue of zodError.issues) {
        const path = issue.path.join('.') || 'body';
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }

      return next(new ValidationError('Validation failed', errors));
    }

    req.body = result.data;
    next();
  };
}
