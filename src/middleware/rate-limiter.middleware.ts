import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { TooManyRequestsError } from '../utils/errors';

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export function createRateLimiter(options: RateLimiterOptions): RateLimitRequestHandler {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new TooManyRequestsError(options.message ?? 'Too many requests, please try again later')
      );
    },
  });
}

/** Strict rate limiter for authentication endpoints: 5 attempts per 15 minutes */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again in 15 minutes',
});

/** General API rate limiter: 100 requests per minute */
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again in a minute',
});
