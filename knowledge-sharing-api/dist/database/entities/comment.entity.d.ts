import { User } from './user.entity';
import { Article } from './article.entity';
export declare class Comment {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    articleId: string;
    article: Article;
    authorId: string;
    author: User;
    parentId?: string;
    parent?: Comment;
    replies: Comment[];
}
