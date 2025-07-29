import { User } from './user.entity';
import { Article } from './article.entity';
export declare class Attachment {
    id: string;
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    path: string;
    downloadCount: number;
    createdAt: Date;
    articleId: string | null;
    article: Article;
    uploadedById: string | null;
    uploadedBy: User | null;
}
