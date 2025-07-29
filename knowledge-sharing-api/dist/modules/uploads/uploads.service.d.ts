import { Repository } from 'typeorm';
import { Attachment } from '../../database/entities/attachment.entity';
export declare class UploadsService {
    private readonly attachmentRepository;
    private readonly uploadPath;
    constructor(attachmentRepository: Repository<Attachment>);
    private ensureUploadDirectoryExists;
    uploadFile(file: Express.Multer.File, userId?: string, articleId?: string): Promise<Attachment>;
    uploadMultipleFiles(files: Express.Multer.File[], userId?: string, articleId?: string): Promise<Attachment[]>;
    findOne(id: string): Promise<Attachment>;
    findAll(): Promise<Attachment[]>;
    remove(id: string): Promise<void>;
    getFileUrl(attachment: Attachment): string;
    incrementDownloadCount(id: string): Promise<void>;
}
