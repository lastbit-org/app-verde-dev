import type { Request, Response } from 'express';
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE_MS } from './auth.constants';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  };
}

export function cookieExtractor(req: Request): string | null {
  const token = req?.cookies?.[AUTH_COOKIE];
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, cookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
