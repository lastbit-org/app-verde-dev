import { randomBytes } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { CSRF_COOKIE } from './auth.constants';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

function cookieOptions() {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export function readCsrfToken(req: Request) {
  const token = req.cookies?.[CSRF_COOKIE];
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export function ensureCsrfCookie(req: Request, res: Response) {
  let token = readCsrfToken(req);

  if (!token) {
    token = randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, token, cookieOptions());
  }

  return token;
}

export function clearCsrfCookie(res: Response) {
  res.clearCookie(CSRF_COOKIE, cookieOptions());
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const token = ensureCsrfCookie(req, res);

  if (SAFE.has(req.method)) {
    return next();
  }

  const header = req.headers['x-csrf-token'];
  if (typeof header !== 'string' || header !== token) {
    res.status(403).json({
      message: 'Invalid CSRF token',
      statusCode: 403,
    });
    return;
  }

  next();
}
