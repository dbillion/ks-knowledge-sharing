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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const path = require("path");
const fs = require("fs/promises");
const attachment_entity_1 = require("../../database/entities/attachment.entity");
let UploadsService = class UploadsService {
    attachmentRepository;
    uploadPath = 'uploads';
    constructor(attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
        void this.ensureUploadDirectoryExists();
    }
    async ensureUploadDirectoryExists() {
        try {
            await fs.access(this.uploadPath);
        }
        catch {
            await fs.mkdir(this.uploadPath, { recursive: true });
        }
    }
    async uploadFile(file, userId, articleId) {
        if (!file) {
            throw new Error('No file provided');
        }
        const fileExtension = path.extname(file.originalname);
        const uniqueFilename = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path.join(this.uploadPath, uniqueFilename);
        try {
            await fs.writeFile(filePath, file.buffer);
            const attachment = this.attachmentRepository.create({
                originalName: file.originalname,
                filename: uniqueFilename,
                mimetype: file.mimetype,
                size: file.size,
                path: filePath,
                uploadedById: userId || null,
                articleId: articleId || null,
            });
            const savedAttachment = await this.attachmentRepository.save(attachment);
            return savedAttachment;
        }
        catch (error) {
            try {
                await fs.unlink(filePath);
            }
            catch {
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to upload file: ${errorMessage}`);
        }
    }
    async uploadMultipleFiles(files, userId, articleId) {
        const uploadPromises = files.map((file) => this.uploadFile(file, userId, articleId));
        return Promise.all(uploadPromises);
    }
    async findOne(id) {
        const attachment = await this.attachmentRepository.findOne({
            where: { id },
            relations: ['uploadedBy', 'article'],
        });
        if (!attachment) {
            throw new common_1.NotFoundException('File not found');
        }
        return attachment;
    }
    async findAll() {
        return this.attachmentRepository.find({
            relations: ['uploadedBy', 'article'],
            order: { createdAt: 'DESC' },
        });
    }
    async remove(id) {
        const attachment = await this.findOne(id);
        try {
            await fs.unlink(attachment.path);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.warn(`Failed to delete file from disk: ${errorMessage}`);
        }
        await this.attachmentRepository.remove(attachment);
    }
    getFileUrl(attachment) {
        return `/uploads/${attachment.filename}`;
    }
    async incrementDownloadCount(id) {
        await this.attachmentRepository.increment({ id }, 'downloadCount', 1);
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map