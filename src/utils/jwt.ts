import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/environment';
import { UnauthorizedError } from './errors';

export function generateToken(payload: Record<string, unknown>, expiresIn?: number): string {
  const options: SignOptions = {
    expiresIn: expiresIn ?? env.JWT_EXPIRY,
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string') {
      throw new UnauthorizedError('Invalid token format');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  if (typeof decoded === 'string' || decoded === null) {
    return null;
  }
  return decoded;
}
