import { ArticleStatus } from '../../common/enums/article-status.enum';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Version } from './version.entity';
import { Comment } from './comment.entity';
import { Attachment } from './attachment.entity';
export declare class Article {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    status: ArticleStatus;
    viewCount: number;
    imageUrl?: string;
    thumbnailUrl?: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: User;
    categoryId: string;
    category: Category;
    tags: Tag[];
    versions: Version[];
    comments: Comment[];
    attachments: Attachment[];
}
