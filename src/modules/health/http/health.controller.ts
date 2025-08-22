import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Verifica o status da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'A aplicação está funcionando corretamente.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-08-22T02:20:30.000Z',
      },
    },
  })
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
