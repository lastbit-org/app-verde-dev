import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { cookieExtractor } from './cookie';
import { resolveJwtSecret } from './jwt-secret';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret(config),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      return await this.usersService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
