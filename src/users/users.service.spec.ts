import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { createUserDtoFixture } from './fixtures/create-user.dto';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { userTableFixture } from './fixtures/user.table';
import { UserEntity } from './entities/user.entity';
import { updateUserDtoFixture } from './fixtures/update-user.dto';

jest.mock('../common/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findOne', () => {
    it('should find a user with the given id', async () => {
      const userTable = userTableFixture();

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(userTable);

      const user = await service.findById(userTable.id);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userTable.id },
      });
      expect(user).toEqual(new UserEntity(userTable));
    });

    it('should throw NotFoundException if user with given id does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        new ConflictException('User with id: non-existent-id not found'),
      );
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Some error'),
      );

      await expect(service.findById('some-id')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = createUserDtoFixture();
      const userTable = userTableFixture();

      (prismaService.user.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.user.create as jest.Mock).mockResolvedValue(userTable);

      const response = await service.create(createUserDto);

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ id: createUserDto.id }, { email: createUserDto.email }],
        },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(response).toEqual(new UserEntity(userTable));
    });

    it('should throw ConflictException if a user with that id or email already exists', async () => {
      const createUserDto = createUserDtoFixture();

      (prismaService.user.findMany as jest.Mock).mockResolvedValue([
        userTableFixture({
          id: createUserDto.id,
          email: createUserDto.email,
        }),
      ]);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException(
          `User with id: ${createUserDto.id} or email: ${createUserDto.email} already exists`,
        ),
      );
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const createUserDto = createUserDtoFixture();

      (prismaService.user.create as jest.Mock).mockRejectedValue(
        new Error("Can't connect to database"),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = updateUserDtoFixture();
      const userTable = userTableFixture();

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(userTable);
      (prismaService.user.update as jest.Mock).mockResolvedValue({
        ...userTable,
        ...updateUserDto,
      });

      const response = await service.update(userTable.id, updateUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userTable.id },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userTable.id },
        data: updateUserDto,
      });
      expect(response).toEqual(
        new UserEntity({
          ...userTable,
          ...updateUserDto,
        }),
      );
    });

    it('should throw NotFoundException if user with given id does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateUserDtoFixture()),
      ).rejects.toThrow(
        new ConflictException('User with id: non-existent-id not found'),
      );
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const updateUserDto = updateUserDtoFixture();
      const userTable = userTableFixture();

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(userTable);
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new Error("Can't connect to database"),
      );

      await expect(service.update(userTable.id, updateUserDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
