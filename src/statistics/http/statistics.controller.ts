import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetStatisticsUseCase } from '../use-cases/get-statistics.use-case';
import { StatisticsResponseDto } from '../dto/statistic-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter estatísticas das transações dos últimos 60 segundos',
  })
  @ApiOkResponse({
    description: 'Estatísticas calculadas com sucesso',
    type: StatisticsResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async getStatistics(): Promise<StatisticsResponseDto> {
    return await this.getStatisticsUseCase.execute();
  }
}
