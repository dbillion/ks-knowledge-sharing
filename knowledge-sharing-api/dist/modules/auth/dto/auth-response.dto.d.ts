import { UserRole } from '../../../common/enums/user-role.enum';
export declare class UserResponseDto {
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
}
export declare class AuthResponseDto {
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
