import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerService } from './infra/logger/logger.service';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(PinoLoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('API para gerenciamento de transações financeiras')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `Application is running on port ${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );

  logger.log(
    `📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
    'Bootstrap',
  );
}
bootstrap();
