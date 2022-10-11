import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.find(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async createUser(newUser: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(newUser);

    const createUserDto = plainToClass(CreateUserDto, user);

    if (!user) {
      throw new HttpException('User not created', 500);
    }

    return createUserDto;
  }
}
