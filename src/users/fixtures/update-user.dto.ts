import { faker } from '@faker-js/faker';
import { UpdateUserDto } from '../dto/update-user.dto';

export const updateUserDtoFixture = (
  overrides?: Partial<UpdateUserDto>,
): UpdateUserDto => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  ...overrides,
});
