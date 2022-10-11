import { PrismaClient } from '@prisma/client';
import { userEntityFixture } from '../src/users/fixtures/user.entity';

const prismaClient = new PrismaClient();

const USER_COUNT = 3;

const seed = async () => {
  await prismaClient.user.createMany({
    data: [...Array(USER_COUNT)].map(userEntityFixture),
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
