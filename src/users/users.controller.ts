import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/v1/users - Create a user
   * @param {CreateUserDto} createUserDto - The user to create
   * @return {Promise<UserEntity>} The created user
   */
  @Post()
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'The created user',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }
}
