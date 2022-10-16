import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { createUserDtoFixture } from './fixtures/create-user.dto';
import { userEntityFixture } from './fixtures/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersController', () => {
  let service: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userEntity = userEntityFixture();
      const createUserDto = createUserDtoFixture();

      (service.create as jest.Mock).mockResolvedValue(userEntity);

      const response = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual(userEntity);
    });

    it("should throw if the UserService's create method throws", async () => {
      const createUserDto = createUserDtoFixture();

      (service.create as jest.Mock).mockRejectedValue(new Error());

      await expect(controller.create(createUserDto)).rejects.toThrow();
    });
  });
});
