"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
class PaginationUtil {
    static paginate(data, totalCount, page, limit) {
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
    static getSkip(page, limit) {
        return (page - 1) * limit;
    }
}
exports.PaginationUtil = PaginationUtil;
//# sourceMappingURL=pagination.util.js.map