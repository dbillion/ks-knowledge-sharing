import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
export declare const databaseConfig: () => TypeOrmModuleOptions;
export declare const dataSourceConfig: DataSourceOptions;
