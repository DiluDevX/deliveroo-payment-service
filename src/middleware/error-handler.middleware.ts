import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ValidationError) {
    logger.warn({ err: error, path: req.path, method: req.method }, 'Validation error');
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    if (error.isOperational) {
      logger.warn({ err: error, path: req.path, method: req.method }, 'Operational error');
    } else {
      logger.error({ err: error, path: req.path, method: req.method }, 'Non-operational error');
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
    return;
  }

  // Unknown/unexpected errors — do not leak details
  logger.error({ err: error, path: req.path, method: req.method }, 'Unexpected error');
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
