import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Find a user with the given id, or throw an error if the user does not exist
   * @param {UserEntity['id']} id - The id of the user to find
   * @return {UserEntity} The user with the given id, if it exists
   * @throws {NotFoundException} If the user does not exist
   * @throws {InternalServerErrorException} If an error occurs
   */
  async findById(id: UserEntity['id']): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      return new UserEntity(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  /**
   * Create a user, or throw an error if the user already exists
   * @param {CreateUserDto} createUserDto - The user to create
   * @return {Promise<UserEntity>} The created user
   * @throws {ConflictException} If the user already exists
   * @throws {InternalServerErrorException} If an error occurs
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

  /**
   * Update a user, or throw an error if the user does not exist
   * @param {UserEntity['id']} id - The id of the user to update
   * @param {UpdateUserDto} updateUserDto - The user to update
   * @return {Promise<UserEntity>} The updated user
   * @throws {NotFoundException} If the user does not exist
   * @throws {InternalServerErrorException} If an error occurs
   */
  async update(
    id: UserEntity['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(id);

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: updateUserDto,
      });

      return new UserEntity(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
