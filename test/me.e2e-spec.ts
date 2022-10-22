import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { FirebaseService } from '../src/common/firebase/firebase.service';
import { createUserDtoFixture } from '../src/users/fixtures/create-user.dto';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('/api/v1/me', () => {
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

  describe('GET', () => {
    describe('Success', () => {
      it('200', async () => {
        const createUserDto = createUserDtoFixture();

        await prismaService.user.create({
          data: createUserDto,
        });

        (firebaseService.auth.verifyIdToken as jest.Mock).mockResolvedValue({
          user_id: createUserDto.id,
        });

        const res = await request(app.getHttpServer())
          .get('/v1/me')
          .set('Authorization', 'Bearer token')
          .expect(200);

        expect(res.body).toEqual({
          ...createUserDto,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('Failure', () => {
      it('401', async () => {
        await request(app.getHttpServer()).get('/v1/me').expect(401);
      });

      it('404', () => {
        (firebaseService.auth.verifyIdToken as jest.Mock).mockResolvedValue({
          user_id: 'non-existent-user-id',
        });

        return request(app.getHttpServer())
          .get('/v1/me')
          .set('Authorization', 'Bearer token')
          .expect(404);
      });
    });
  });
});
