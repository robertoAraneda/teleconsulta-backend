import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import helmet from 'helmet';
import { ValidationPipe } from './pipes/validation.pipe';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  const configService = app.get(ConfigService);

  app.enableCors({ origin: '*' });

  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const PORT = configService.get('SERVER_PORT');

  await app.listen(PORT);

  logger.log(`Aplication listening on port ${PORT}`);
  logger.log(`Aplication running in ${process.env.NODE_ENV} mode`);
  logger.log(`Database connected is ${process.env.DB_DATABASE}`);
}
bootstrap();
