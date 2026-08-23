import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../users/user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
