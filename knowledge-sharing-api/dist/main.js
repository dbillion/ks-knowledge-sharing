"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200'],
        credentials: true,
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map