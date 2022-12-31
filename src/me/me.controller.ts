import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { MyId } from './decorators/my-id.decorator';

@Controller({
  path: 'me',
  version: '1',
})
@ApiTags('Current user')
@ApiBearerAuth()
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/me - Get the current user
   * @param {UserEntity['id']} myId - The id of the current user
   * @return {Promise<UserEntity>} The current user
   */
  @Get()
  @ApiOkResponse({
    type: UserEntity,
    description: 'The current user',
  })
  async get(@MyId() myId: UserEntity['id']): Promise<UserEntity> {
    return this.usersService.findById(myId);
  }

  /**
   * PUT /api/v1/me - Update the current user
   * @param {UserEntity['id']} myId - The id of the current user
   * @param {UpdateUserDto} updateUserDto - The user to update
   * @return {Promise<UserEntity>} The updated user
   */
  @Put()
  @ApiOkResponse({
    type: UserEntity,
    description: 'The updated user',
  })
  async update(
    @MyId() myId: UserEntity['id'],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(myId, updateUserDto);
  }
}
