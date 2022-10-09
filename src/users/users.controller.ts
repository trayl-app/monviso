import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':createUser')
  createUser(@Body() newUser: User) {
    return this.usersService.createUser(newUser);
  }
}
