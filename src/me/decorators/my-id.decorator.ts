import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedRequest } from '../../auth/types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export const MyId = createParamDecorator<CreateUserDto['id']>(
  (_, ctx: ExecutionContext) => {
    const request: AuthorizedRequest = ctx.switchToHttp().getRequest();

    return request.auth.user_id;
  },
);
