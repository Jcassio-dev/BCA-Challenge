import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({
    example: 5,
    description: 'Número total de transações nos últimos 60 segundos',
  })
  count: number;

  @ApiProperty({
    example: 1234.56,
    description: 'Soma total dos valores das transações',
  })
  sum: number;

  @ApiProperty({
    example: 246.91,
    description: 'Valor médio das transações',
  })
  avg: number;

  @ApiProperty({
    example: 12.34,
    description: 'Menor valor transacionado',
  })
  min: number;

  @ApiProperty({
    example: 456.78,
    description: 'Maior valor transacionado',
  })
  max: number;

  constructor(partial: Partial<StatisticsResponseDto>) {
    Object.assign(this, partial);
  }
}
