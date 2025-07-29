"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const uploads_service_1 = require("./uploads.service");
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadFile(file, userId, articleId) {
        return this.uploadsService.uploadFile(file, userId, articleId);
    }
    async uploadMultipleFiles(files, userId, articleId) {
        return this.uploadsService.uploadMultipleFiles(files, userId, articleId);
    }
    async findOne(id) {
        return this.uploadsService.findOne(id);
    }
    async remove(id) {
        await this.uploadsService.remove(id);
        return { message: 'File deleted successfully' };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        type: 'string',
        description: 'User ID (owner of the file)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'articleId',
        required: false,
        type: 'string',
        description: 'Article ID (if file belongs to an article)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                filename: { type: 'string' },
                originalName: { type: 'string' },
                mimeType: { type: 'string' },
                size: { type: 'number' },
                path: { type: 'string' },
                url: { type: 'string' },
                createdAt: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or file too large' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        type: 'string',
        description: 'User ID (owner of the files)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'articleId',
        required: false,
        type: 'string',
        description: 'Article ID (if files belong to an article)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            filename: { type: 'string' },
                            originalName: { type: 'string' },
                            mimeType: { type: 'string' },
                            size: { type: 'number' },
                            path: { type: 'string' },
                            url: { type: 'string' },
                            createdAt: { type: 'string' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'File ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File found successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'File ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "remove", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('File Uploads'),
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map