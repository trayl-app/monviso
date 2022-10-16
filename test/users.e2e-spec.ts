import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { FirebaseService } from '../src/firebase/firebase.service';
import { createUserDtoFixture } from '../src/users/fixtures/create-user.dto';

describe('/api/v1/users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST', () => {
    it('201', async () => {
      const createUserDto = createUserDtoFixture();

      const res = await request(app.getHttpServer())
        .post('/v1/users')
        .send(createUserDto);

      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        ...createUserDto,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
