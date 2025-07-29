import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): {
        message: string;
        data: CreateUserDto;
    };
    findAll(paginationDto: PaginationDto, search?: string): {
        message: string;
        data: never[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
    getMe(): {
        message: string;
        id: string;
    };
    findOne(id: string): {
        message: string;
        id: string;
    };
    update(id: string, updateUserDto: UpdateUserDto): {
        message: string;
        id: string;
        data: UpdateUserDto;
    };
    remove(id: string): {
        message: string;
        id: string;
    };
}
