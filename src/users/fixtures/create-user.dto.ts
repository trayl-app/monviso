import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dto/create-user.dto';

export const createUserDtoFixture = (
  overrides?: Partial<CreateUserDto>,
): CreateUserDto => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(firstName, lastName),
    firstName,
    lastName,
    ...overrides,
  };
};
