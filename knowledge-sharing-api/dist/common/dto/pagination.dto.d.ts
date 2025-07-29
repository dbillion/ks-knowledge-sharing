export declare class PaginationDto {
    page?: number;
    limit?: number;
}
export declare class PaginatedResponse<T> {
    data: T[];
    meta: {
        totalCount: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
