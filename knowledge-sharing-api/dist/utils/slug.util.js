"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugUtil = void 0;
class SlugUtil {
    static generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    static generateUniqueSlug(baseSlug, existingSlugs) {
        let slug = baseSlug;
        let counter = 1;
        while (existingSlugs.includes(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
}
exports.SlugUtil = SlugUtil;
//# sourceMappingURL=slug.util.js.map