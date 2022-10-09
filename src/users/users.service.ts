import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
