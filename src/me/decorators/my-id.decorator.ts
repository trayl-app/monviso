import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/auth/auth.middleware';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export const MyId = createParamDecorator<CreateUserDto['id']>(
  (_, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();

    return request.userId;
  },
);
