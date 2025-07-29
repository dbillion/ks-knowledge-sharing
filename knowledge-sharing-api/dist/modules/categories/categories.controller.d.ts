import { CategoriesService } from './categories.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryData: any): {
        message: string;
        data: any;
    };
    findAll(paginationDto: PaginationDto, search?: string): {
        message: string;
        data: never[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
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
    remove(id: string): {
        message: string;
        id: string;
    };
}
