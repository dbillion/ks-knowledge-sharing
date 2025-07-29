import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string, type?: string, page?: number, limit?: number): {
        message: string;
        data: {
            articles: never[];
            categories: never[];
            users: never[];
        };
        meta: {
            total: number;
            query: string;
            type: string | undefined;
            page: number;
            limit: number;
        };
    };
    suggestions(query: string): {
        message: string;
        suggestions: string[];
    };
}
