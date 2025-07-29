import { PaginatedResponse } from '../common/dto/pagination.dto';

export class PaginationUtil {
  static paginate<T>(
    data: T[],
    totalCount: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
