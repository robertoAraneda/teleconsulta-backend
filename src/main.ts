import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import * as config from 'config';
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

  const PORT = process.env.PORT || config.get('server.port');

  await app.listen(PORT);

  logger.log(`Aplication listening on port ${PORT}`);
  logger.log(`Aplication running in ${process.env.NODE_ENV} mode`);
  logger.log(`Database connected is ${process.env.DB_DATABASE}`);
}
bootstrap();
