import { Test, TestingModule } from '@nestjs/testing';
import { GetStatisticsUseCase } from './get-statistics.use-case';
import { TransactionRepository } from 'src/modules/transactions/repositories/transaction.repository';
import { StatisticsResponseDto } from '../dto/statistic-response.dto';

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    mockTransactionRepository = {
      findRecent: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatisticsUseCase,
        { provide: TransactionRepository, useValue: mockTransactionRepository },
      ],
    }).compile();

    useCase = module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty statistics when there are no recent transactions', async () => {
    mockTransactionRepository.findRecent.mockResolvedValueOnce([]);

    const result = await useCase.execute();

    expect(result).toEqual(
      new StatisticsResponseDto({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      }),
    );
    expect(mockTransactionRepository.findRecent).toHaveBeenCalledWith(60);
  });

  it('should calculate statistics for recent transactions', async () => {
    const recentTransactions = [
      { amount: 100 },
      { amount: 200 },
      { amount: 50 },
    ] as any;
    mockTransactionRepository.findRecent.mockResolvedValueOnce(
      recentTransactions,
    );

    const result = await useCase.execute();

    expect(result).toEqual(
      new StatisticsResponseDto({
        count: 3,
        sum: 350,
        avg: 116.67,
        min: 50,
        max: 200,
      }),
    );
    expect(mockTransactionRepository.findRecent).toHaveBeenCalledWith(60);
  });

  it('should round statistics to two decimal places', async () => {
    const recentTransactions = [
      { amount: 123.456 },
      { amount: 78.123 },
      { amount: 45.789 },
    ] as any;
    mockTransactionRepository.findRecent.mockResolvedValueOnce(
      recentTransactions,
    );

    const result = await useCase.execute();

    expect(result).toEqual(
      new StatisticsResponseDto({
        count: 3,
        sum: 247.37,
        avg: 82.46,
        min: 45.79,
        max: 123.46,
      }),
    );
    expect(mockTransactionRepository.findRecent).toHaveBeenCalledWith(60);
  });
});
