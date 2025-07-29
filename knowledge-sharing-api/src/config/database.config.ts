import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // PostgreSQL Configuration for Production
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Never in production
      logging: false,
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      ssl: true,
    };
  } else {
    // SQLite Configuration for Development
    return {
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'knowledge_sharing.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development
      logging: true,
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    };
  }
};

export const dataSourceConfig: DataSourceOptions =
  databaseConfig() as DataSourceOptions;
