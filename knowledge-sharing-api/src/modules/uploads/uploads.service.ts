import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Attachment } from '../../database/entities/attachment.entity';

@Injectable()
export class UploadsService {
  private readonly uploadPath = 'uploads';

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {
    void this.ensureUploadDirectoryExists();
  }

  private async ensureUploadDirectoryExists() {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId?: string,
    articleId?: string,
  ): Promise<Attachment> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate unique filename while preserving extension
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, uniqueFilename);

    try {
      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Create database record
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
    } catch (error) {
      // Clean up file if database save fails
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload file: ${errorMessage}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId?: string,
    articleId?: string,
  ): Promise<Attachment[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, userId, articleId),
    );
    return Promise.all(uploadPromises);
  }

  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['uploadedBy', 'article'],
    });

    if (!attachment) {
      throw new NotFoundException('File not found');
    }

    return attachment;
  }

  async findAll(): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      relations: ['uploadedBy', 'article'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const attachment = await this.findOne(id);

    try {
      // Delete file from disk
      await fs.unlink(attachment.path);
    } catch (error) {
      // Log error but continue with database deletion
      const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to delete file from disk: ${errorMessage}`);
    }

    // Delete database record
    await this.attachmentRepository.remove(attachment);
  }

  getFileUrl(attachment: Attachment): string {
    // In production, this would return a proper URL (e.g., CDN link)
    return `/uploads/${attachment.filename}`;
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.attachmentRepository.increment({ id }, 'downloadCount', 1);
  }
}
