import { faker } from '@faker-js/faker';
import { UserEntity } from '../entities/user.entity';

export const userEntityFixture = (
  overrides?: Partial<UserEntity>,
): UserEntity => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(firstName, lastName),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
};
