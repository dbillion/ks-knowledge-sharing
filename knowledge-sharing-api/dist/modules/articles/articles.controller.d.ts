import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ArticleStatus } from '../../common/enums/article-status.enum';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto): {
        message: string;
        data: CreateArticleDto;
    };
    findAll(paginationDto: PaginationDto, search?: string, category?: string, tag?: string, status?: ArticleStatus, author?: string): {
        message: string;
        data: never[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        filters: {
            search: string | undefined;
            category: string | undefined;
            tag: string | undefined;
            status: ArticleStatus | undefined;
            author: string | undefined;
        };
    };
    findPublished(paginationDto: PaginationDto, search?: string, category?: string, tag?: string): {
        message: string;
        data: never[];
        filters: {
            search: string | undefined;
            category: string | undefined;
            tag: string | undefined;
            status: ArticleStatus;
        };
    };
    findMyArticles(paginationDto: PaginationDto, status?: ArticleStatus): {
        message: string;
        data: never[];
        filters: {
            status: ArticleStatus | undefined;
        };
    };
    findOne(id: string): {
        message: string;
        id: string;
    };
    findBySlug(slug: string): {
        message: string;
        slug: string;
    };
    update(id: string, updateData: any): {
        message: string;
        id: string;
        data: any;
    };
    publish(id: string): {
        message: string;
        id: string;
        status: ArticleStatus;
    };
    unpublish(id: string): {
        message: string;
        id: string;
        status: ArticleStatus;
    };
    remove(id: string): {
        message: string;
        id: string;
    };
}
