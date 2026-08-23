import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import type { User } from '../users/user';
import { JWT_EXPIRES_IN } from './auth.constants';
import { clearAuthCookie, setAuthCookie } from './cookie';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async issueSession(
    user: User,
    res: Response,
    req?: Request,
  ): Promise<User> {
    const token = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: JWT_EXPIRES_IN },
    );
    setAuthCookie(res, token, req);
    return user;
  }

  logout(res: Response) {
    clearAuthCookie(res);
    return { ok: true as const };
  }
}
