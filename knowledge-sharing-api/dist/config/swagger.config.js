"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Knowledge Sharing API')
        .setDescription('A comprehensive knowledge sharing platform API')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('articles', 'Article management')
        .addTag('categories', 'Category management')
        .addTag('search', 'Search functionality')
        .addTag('uploads', 'File upload endpoints')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
//# sourceMappingURL=swagger.config.js.map