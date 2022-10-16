import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a user
   * @param {CreateUserDto} createUserDto - The user to create
   * @return {Promise<UserEntity>} The created user
   * @throws {ConflictException} If the user already exists
   * @throws {InternalServerErrorException} If the user could not be created
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const existingUsers = await this.prismaService.user.findMany({
        where: {
          OR: [{ id: createUserDto.id }, { email: createUserDto.email }],
        },
      });

      if (existingUsers.length > 0) {
        throw new ConflictException(
          `User with id: ${createUserDto.id} or email: ${createUserDto.email} already exists`,
        );
      }

      const createdUser = await this.prismaService.user.create({
        data: createUserDto,
      });

      return new UserEntity(createdUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
