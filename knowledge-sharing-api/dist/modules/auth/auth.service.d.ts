import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../../common/enums/user-role.enum';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRole;
            avatar?: string;
            isActive: boolean;
            emailVerified: boolean;
            lastLoginAt?: Date;
            createdAt: Date;
            updatedAt: Date;
            articles: import("../../database/entities/article.entity").Article[];
            comments: import("../../database/entities/comment.entity").Comment[];
            versions: import("../../database/entities/version.entity").Version[];
            attachments: import("../../database/entities/attachment.entity").Attachment[];
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRole;
            avatar?: string;
            isActive: boolean;
            emailVerified: boolean;
            lastLoginAt?: Date;
            createdAt: Date;
            updatedAt: Date;
            articles: import("../../database/entities/article.entity").Article[];
            comments: import("../../database/entities/comment.entity").Comment[];
            versions: import("../../database/entities/version.entity").Version[];
            attachments: import("../../database/entities/attachment.entity").Attachment[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        avatar?: string;
        isActive: boolean;
        emailVerified: boolean;
        lastLoginAt?: Date;
        createdAt: Date;
        updatedAt: Date;
        articles: import("../../database/entities/article.entity").Article[];
        comments: import("../../database/entities/comment.entity").Comment[];
        versions: import("../../database/entities/version.entity").Version[];
        attachments: import("../../database/entities/attachment.entity").Attachment[];
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    validateUser(payload: any): Promise<any>;
}
