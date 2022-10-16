import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { MyId } from './decorators/myId.decorator';

@Controller('v1/me')
@ApiTags('Current user')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/me - Get the current user
   * @param {CreateUserDto['id']} myId - The id of the current user
   * @return {Promise<UserEntity>} The current user
   */
  @Get()
  @ApiOkResponse({
    type: UserEntity,
    description: 'The current user',
  })
  async get(@MyId() myId: CreateUserDto['id']): Promise<UserEntity> {
    return this.usersService.findByIdOrThrow(myId);
  }
}
