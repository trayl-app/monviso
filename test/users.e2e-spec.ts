import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { FirebaseService } from '../src/firebase/firebase.service';
import { createUserDtoFixture } from '../src/users/fixtures/create-user.dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('/api/v1/users', () => {
  let app: INestApplication;
  let firebaseService: FirebaseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue({
        auth: {
          verifyIdToken: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    firebaseService = moduleFixture.get<FirebaseService>(FirebaseService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST', () => {
    describe('Success', () => {
      it('201', async () => {
        const createUserDto = createUserDtoFixture();

        (firebaseService.auth.verifyIdToken as jest.Mock).mockResolvedValue({
          user_id: createUserDto.id,
        });

        const res = await request(app.getHttpServer())
          .post('/v1/users')
          .send(createUserDto)
          .set('Authorization', 'Bearer token')
          .expect(201);

        expect(res.body).toEqual({
          ...createUserDto,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('Failure', () => {
      it('401', async () => {
        (firebaseService.auth.verifyIdToken as jest.Mock).mockRejectedValue(
          new Error('error'),
        );

        await request(app.getHttpServer()).post('/v1/users').send().expect(401);
      });

      it('409', async () => {
        const createUserDto = createUserDtoFixture();

        await prismaService.user.create({
          data: createUserDto,
        });

        (firebaseService.auth.verifyIdToken as jest.Mock).mockResolvedValue({
          user_id: createUserDto.id,
        });

        await request(app.getHttpServer())
          .post('/v1/users')
          .send(createUserDto)
          .set('Authorization', 'Bearer token')
          .expect(409);
      });
    });
  });
});
