import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export const userEntityFixture = (overrides?: Partial<User>): User => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(firstName, lastName),
    firstName,
    lastName,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
};
