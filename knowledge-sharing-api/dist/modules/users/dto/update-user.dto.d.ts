import { UserRole } from '../../../common/enums/user-role.enum';
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
}
