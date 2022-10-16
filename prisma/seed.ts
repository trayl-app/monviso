import { PrismaClient } from '@prisma/client';
import { userTableFixture } from '../src/users/fixtures/user.table';

const prismaClient = new PrismaClient();

const USER_COUNT = 3;

const seed = async () => {
  await prismaClient.user.createMany({
    data: [...Array(USER_COUNT)].map(userTableFixture),
  });
};

seed()
  .catch(async () => {
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
    process.exit(0);
  });
