import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Statistics (e2e)', () => {
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

  beforeEach(async () => {
    await request(app.getHttpServer()).delete('/transactions');
  });

  it('GET /statistics - Deve retornar estatísticas corretas', async () => {
    const transactions = [
      { amount: 100.5, timestamp: new Date().toISOString() },
      { amount: 200.75, timestamp: new Date().toISOString() },
    ];

    for (const transaction of transactions) {
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(HttpStatus.CREATED);
    }

    const response = await request(app.getHttpServer())
      .get('/statistics')
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      count: 2,
      sum: 301.25,
      avg: 150.63,
      min: 100.5,
      max: 200.75,
    });
  });

  it('GET /statistics - Deve retornar estatísticas vazias quando não há transações', async () => {
    const response = await request(app.getHttpServer())
      .get('/statistics')
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });
});
