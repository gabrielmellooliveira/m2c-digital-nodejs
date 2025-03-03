import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestDto } from '../dtos/user-request.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserRequestDto;
  },
);