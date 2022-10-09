import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const userEntityFixture = (overrides?: Partial<User>): User => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: faker.date.birthdate(),
  updatedAt: faker.date.birthdate(),
  ...overrides,
});
