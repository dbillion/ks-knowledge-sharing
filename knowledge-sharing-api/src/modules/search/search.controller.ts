import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across articles, categories, and users' })
  @ApiQuery({ name: 'q', type: String, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Content type filter (articles, categories, users)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            articles: { type: 'array' },
            categories: { type: 'array' },
            users: { type: 'array' },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            query: { type: 'string' },
            type: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
      },
    },
  })
  search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return {
      message: 'Global search endpoint - implementation pending',
      data: {
        articles: [],
        categories: [],
        users: [],
      },
      meta: {
        total: 0,
        query,
        type,
        page: page || 1,
        limit: limit || 10,
      },
    };
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'q', type: String, description: 'Partial search query' })
  @ApiResponse({
    status: 200,
    description: 'Search suggestions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  suggestions(@Query('q') query: string) {
    return {
      message: 'Search suggestions endpoint - implementation pending',
      suggestions: [`${query} suggestion 1`, `${query} suggestion 2`],
    };
  }
}
