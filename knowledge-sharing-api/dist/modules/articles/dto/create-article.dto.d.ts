export declare class CreateArticleDto {
    title: string;
    content: string;
    excerpt?: string;
    categoryId: string;
    tags?: string[];
    imageUrl?: string;
    isPublished?: boolean;
}
