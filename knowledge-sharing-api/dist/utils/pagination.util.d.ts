import { PaginatedResponse } from '../common/dto/pagination.dto';
export declare class PaginationUtil {
    static paginate<T>(data: T[], totalCount: number, page: number, limit: number): PaginatedResponse<T>;
    static getSkip(page: number, limit: number): number;
}
