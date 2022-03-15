import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.SERVER_PORT;

  await app.listen(PORT);

  logger.log(`Aplication listening on port ${PORT}`);
  logger.log(`Aplication running in ${process.env.NODE_ENV} mode`);
  logger.log(`Database connected is ${process.env.DB_DATABASE}`);
}
bootstrap();
