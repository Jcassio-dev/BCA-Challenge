import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Transactions (e2e)', () => {
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

  it('POST /transactions - Deve criar uma transação', async () => {
    const transaction = {
      amount: 100.5,
      timestamp: new Date().toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(transaction)
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      id: expect.any(String),
      amount: transaction.amount,
      timestamp: transaction.timestamp,
    });
  });

  it('POST /transactions - Deve retornar 422 para transação no futuro', async () => {
    const futureTransaction = {
      amount: 100.5,
      timestamp: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(futureTransaction)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('DELETE /transactions - Deve remover todas as transações', async () => {
    await request(app.getHttpServer())
      .delete('/transactions')
      .expect(HttpStatus.OK);

    const statsResponse = await request(app.getHttpServer())
      .get('/statistics')
      .expect(HttpStatus.OK);

    expect(statsResponse.body).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });
});
