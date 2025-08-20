import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerService } from './infra/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(PinoLoggerService);
  app.useLogger(logger);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `Application is running on port ${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
}
bootstrap();
