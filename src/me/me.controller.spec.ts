import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { userEntityFixture } from '../users/fixtures/user.entity';
import { UsersModule } from '../users/users.module';
import { MeController } from './me.controller';

jest.mock('../users/users.service');

describe('MeController', () => {
  let controller: MeController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      imports: [UsersModule],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    controller = module.get<MeController>(MeController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get', () => {
    it('should return the current user', async () => {
      const userEntity = userEntityFixture();

      (usersService.findByIdOrThrow as jest.Mock).mockResolvedValue(userEntity);

      const response = await controller.get(userEntity.id);

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(userEntity.id);
      expect(response).toEqual(userEntity);
    });

    it("should throw if the UsersService's findByIdOrThrow method throws", async () => {
      (usersService.findByIdOrThrow as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await expect(controller.get('invalid-id')).rejects.toThrow();
    });
  });
});
