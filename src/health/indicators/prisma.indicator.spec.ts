import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PrismaHealthIndicator } from './prisma.indicator';

const mockPrismaService = {
  $queryRaw: jest.fn(),
};

describe('PrismaHealthIndicator', () => {
  let prismaHealthIndicator: PrismaHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaHealthIndicator],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    prismaHealthIndicator = module.get(PrismaHealthIndicator);

    mockPrismaService.$queryRaw.mockResolvedValue('1');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a successful response if the database is up', async () => {
    const actual = await prismaHealthIndicator.isHealthy('database');

    expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);

    const expected = {
      database: {
        status: 'up',
      },
    };

    expect(actual).toEqual(expected);
  });

  it('should return an error response if the database is down', async () => {
    mockPrismaService.$queryRaw.mockRejectedValue('error');

    expect(prismaHealthIndicator.isHealthy('database')).rejects.toThrow(
      'Prisma check failed',
    );

    expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
  });
});
