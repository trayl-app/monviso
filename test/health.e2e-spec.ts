import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('/health', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET', () => {
    describe('Success', () => {
      it('200', async () => {
        const res = await request(app.getHttpServer())
          .get('/health')
          .expect(200);

        expect(res.body).toEqual({
          status: 'ok',
          info: {
            database: {
              status: 'up',
            },
          },
          error: {},
          details: {
            database: {
              status: 'up',
            },
          },
        });
      });
    });
  });
});
