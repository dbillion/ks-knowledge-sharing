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
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const article_status_enum_1 = require("../../common/enums/article-status.enum");
let ArticlesController = class ArticlesController {
    articlesService;
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    create(createArticleDto) {
        return {
            message: 'Create article endpoint - implementation pending',
            data: createArticleDto
        };
    }
    findAll(paginationDto, search, category, tag, status, author) {
        return {
            message: 'Get articles endpoint - implementation pending',
            data: [],
            meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
            filters: { search, category, tag, status, author }
        };
    }
    findPublished(paginationDto, search, category, tag) {
        return {
            message: 'Get published articles endpoint - implementation pending',
            data: [],
            filters: { search, category, tag, status: article_status_enum_1.ArticleStatus.PUBLISHED }
        };
    }
    findMyArticles(paginationDto, status) {
        return {
            message: 'Get my articles endpoint - implementation pending',
            data: [],
            filters: { status }
        };
    }
    findOne(id) {
        return {
            message: 'Get article by ID - implementation pending',
            id
        };
    }
    findBySlug(slug) {
        return {
            message: 'Get article by slug - implementation pending',
            slug
        };
    }
    update(id, updateData) {
        return {
            message: 'Update article endpoint - implementation pending',
            id,
            data: updateData
        };
    }
    publish(id) {
        return {
            message: 'Publish article endpoint - implementation pending',
            id,
            status: article_status_enum_1.ArticleStatus.PUBLISHED
        };
    }
    unpublish(id) {
        return {
            message: 'Unpublish article endpoint - implementation pending',
            id,
            status: article_status_enum_1.ArticleStatus.DRAFT
        };
    }
    remove(id) {
        return {
            message: 'Delete article endpoint - implementation pending',
            id
        };
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new article' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Article created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                slug: { type: 'string' },
                excerpt: { type: 'string' },
                content: { type: 'string' },
                status: { type: 'string' },
                author: { type: 'object' },
                category: { type: 'object' },
                tags: { type: 'array' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all articles with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search by title or content' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String, description: 'Filter by category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'tag', required: false, type: String, description: 'Filter by tag ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: article_status_enum_1.ArticleStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'author', required: false, type: String, description: 'Filter by author ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Articles retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            slug: { type: 'string' },
                            excerpt: { type: 'string' },
                            status: { type: 'string' },
                            author: { type: 'object' },
                            category: { type: 'object' },
                            tags: { type: 'array' },
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
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('tag')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('author')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('published'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all published articles' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'tag', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Published articles retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)('my-articles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get articles by current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: article_status_enum_1.ArticleStatus }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User articles retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findMyArticles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Article ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article found successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                slug: { type: 'string' },
                excerpt: { type: 'string' },
                content: { type: 'string' },
                status: { type: 'string' },
                author: { type: 'object' },
                category: { type: 'object' },
                tags: { type: 'array' },
                versions: { type: 'array' },
                comments: { type: 'array' },
                attachments: { type: 'array' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', type: 'string', description: 'Article slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article found successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update article by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Article ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the author' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish an article' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Article ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article published successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the author' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    (0, swagger_1.ApiOperation)({ summary: 'Unpublish an article' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Article ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article unpublished successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the author' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete article by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Article ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the author' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "remove", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, swagger_1.ApiTags)('Articles'),
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map