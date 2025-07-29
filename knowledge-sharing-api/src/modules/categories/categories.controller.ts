import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        color: { type: 'string' },
        icon: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createCategoryData: any) {
    return {
      message: 'Create category endpoint - implementation pending',
      data: createCategoryData
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or description' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string' },
              color: { type: 'string' },
              icon: { type: 'string' },
              articlesCount: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  findAll(@Query() paginationDto: PaginationDto, @Query('search') search?: string) {
    return {
      message: 'Get categories endpoint - implementation pending',
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return {
      message: 'Get category by ID - implementation pending',
      id
    };
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', type: 'string', description: 'Category slug' })
  @ApiResponse({
    status: 200,
    description: 'Category found successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findBySlug(@Param('slug') slug: string) {
    return {
      message: 'Get category by slug - implementation pending',
      slug
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return {
      message: 'Update category endpoint - implementation pending',
      id,
      data: updateData
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return {
      message: 'Delete category endpoint - implementation pending',
      id
    };
  }
}
