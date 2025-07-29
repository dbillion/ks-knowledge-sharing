import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: Express.Multer.File, userId?: string, articleId?: string): Promise<import("../../database/entities/attachment.entity").Attachment>;
    uploadMultipleFiles(files: Express.Multer.File[], userId?: string, articleId?: string): Promise<import("../../database/entities/attachment.entity").Attachment[]>;
    findOne(id: string): Promise<import("../../database/entities/attachment.entity").Attachment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
