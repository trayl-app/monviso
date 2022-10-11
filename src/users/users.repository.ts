import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Repository } from '../repository';

@Injectable()
export class UsersRepository extends Repository<User> {
  async find(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(newUser: User): Promise<User | null> {
    return this.prisma.user.create({
      data: newUser,
    });
  }
}
