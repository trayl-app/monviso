import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { userEntityFixture } from '../users/fixtures/user.entity';
import { UsersModule } from '../users/users.module';
import { MeController } from './me.controller';
import { updateUserDtoFixture } from '../users/fixtures/update-user.dto';

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

      (usersService.findById as jest.Mock).mockResolvedValue(userEntity);

      const response = await controller.get(userEntity.id);

      expect(usersService.findById).toHaveBeenCalledWith(userEntity.id);
      expect(response).toEqual(userEntity);
    });

    it("should throw if the UsersService's findById method throws", async () => {
      (usersService.findById as jest.Mock).mockRejectedValue(new Error());

      await expect(controller.get('invalid-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = updateUserDtoFixture();
      const userEntity = userEntityFixture();

      (usersService.update as jest.Mock).mockResolvedValue({
        ...userEntity,
        ...updateUserDto,
      });

      const response = await controller.update(userEntity.id, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(
        userEntity.id,
        updateUserDto,
      );
      expect(response).toEqual({
        ...userEntity,
        ...updateUserDto,
      });
    });

    it("should throw if the UsersService's update method throws", async () => {
      const updateUserDto = updateUserDtoFixture();

      (usersService.update as jest.Mock).mockRejectedValue(new Error());

      await expect(
        controller.update('invalid-id', updateUserDto),
      ).rejects.toThrow();
    });
  });
});
