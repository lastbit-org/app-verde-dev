import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { User } from '../users/user';
import { ChangePasswordDto, CreateUserDto, UpsertAddressDto } from '../users/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { ensureCsrfCookie } from './csrf';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('csrf')
  csrf(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return { csrfToken: ensureCsrfCookie(req, res) };
  }

  @Post('signup')
  async signup(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.usersService.create(dto);
    return this.authService.issueSession(user, res, req);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    return this.authService.issueSession(user, res, req);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User): User {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
    return { ok: true as const };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  upsertAddress(
    @CurrentUser() user: User,
    @Body() dto: UpsertAddressDto,
  ): Promise<User> {
    return this.usersService.upsertAddress(user.id, dto);
  }
}
