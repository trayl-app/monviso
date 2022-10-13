import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Test endpoint
   *
   * POST /v1/users
   * @param {CreateUserDto} createUserDto - The user to create
   * @returns {Promise<UserEntity>} The created user
   */
  @Post()
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'The created user',
  })
  async test(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = await this.usersService.test(createUserDto);

    return new UserEntity(createdUser);
  }
}
