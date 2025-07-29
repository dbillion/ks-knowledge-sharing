import { UserRole } from '../../common/enums/user-role.enum';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Version } from './version.entity';
import { Attachment } from './attachment.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    articles: Article[];
    comments: Comment[];
    versions: Version[];
    attachments: Attachment[];
}
