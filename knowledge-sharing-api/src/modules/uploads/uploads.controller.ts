import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@ApiTags('File Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'userId',
    required: false,
    type: 'string',
    description: 'User ID (owner of the file)',
  })
  @ApiQuery({
    name: 'articleId',
    required: false,
    type: 'string',
    description: 'Article ID (if file belongs to an article)',
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId?: string,
    @Query('articleId') articleId?: string,
  ) {
    return this.uploadsService.uploadFile(file, userId, articleId);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Maximum 10 files
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'userId',
    required: false,
    type: 'string',
    description: 'User ID (owner of the files)',
  })
  @ApiQuery({
    name: 'articleId',
    required: false,
    type: 'string',
    description: 'Article ID (if files belong to an article)',
  })
  @ApiResponse({
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
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('userId') userId?: string,
    @Query('articleId') articleId?: string,
  ) {
    return this.uploadsService.uploadMultipleFiles(files, userId, articleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File found successfully',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.uploadsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.uploadsService.remove(id);
    return { message: 'File deleted successfully' };
  }
}
