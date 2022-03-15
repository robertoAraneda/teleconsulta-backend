import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: 'all',
  //autoLoadEntities: true,
  entities: [join(__dirname, '../**', 'entities/*.entity.{ts,js}')],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    migrationsDir: 'src/migration',
  },
  synchronize: false,
};

export const OrmConfig = {
  ...typeormConfig,
};
export default OrmConfig;
