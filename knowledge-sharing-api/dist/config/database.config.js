"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceConfig = exports.databaseConfig = void 0;
const databaseConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: false,
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            ssl: true,
        };
    }
    else {
        return {
            type: 'sqlite',
            database: process.env.DB_DATABASE || 'knowledge_sharing.db',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        };
    }
};
exports.databaseConfig = databaseConfig;
exports.dataSourceConfig = (0, exports.databaseConfig)();
//# sourceMappingURL=database.config.js.map