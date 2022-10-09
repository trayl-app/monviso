import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const userEntityFixture = (overrides?: Partial<User>): User => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  name: faker.name.fullName(),
  ...overrides,
});
