import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health Check (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health - Deve retornar status ok', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
    });
  });
});
