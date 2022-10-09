import { userEntityFixture } from '../src/common/fixtures/user.entity';
import { PrismaClient } from './client';

const prismaClient = new PrismaClient();

const USER_COUNT = 3;

const seed = async () => {
  await prismaClient.user.createMany({
    data: [...Array(USER_COUNT)].map(userEntityFixture),
  });
};

seed()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async () => {
    await prismaClient.$disconnect();

    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
