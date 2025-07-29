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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    search(query, type, page, limit) {
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
    suggestions(query) {
        return {
            message: 'Search suggestions endpoint - implementation pending',
            suggestions: [`${query} suggestion 1`, `${query} suggestion 2`],
        };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Global search across articles, categories, and users' }),
    (0, swagger_1.ApiQuery)({ name: 'q', type: String, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String, description: 'Content type filter (articles, categories, users)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get search suggestions' }),
    (0, swagger_1.ApiQuery)({ name: 'q', type: String, description: 'Partial search query' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "suggestions", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map