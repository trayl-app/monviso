import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { createUserDtoFixture } from './fixtures/create-user.dto';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { userTableFixture } from './fixtures/user.table';
import { UserEntity } from './entities/user.entity';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
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

  it('should throw InternalServerErrorException if the PrismaService throws', async () => {
    const createUserDto = createUserDtoFixture();

    (prismaService.user.create as jest.Mock).mockRejectedValue(
      new Error("Can't connect to database"),
    );

    await expect(service.create(createUserDto)).rejects.toThrow(
      new InternalServerErrorException(),
    );
  });
});
