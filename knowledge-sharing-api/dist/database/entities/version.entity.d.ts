import { User } from './user.entity';
import { Article } from './article.entity';
export declare class Version {
    id: string;
    versionNumber: number;
    title: string;
    content: string;
    changeSummary?: string;
    createdAt: Date;
    articleId: string;
    article: Article;
    authorId: string;
    author: User;
}
