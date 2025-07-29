import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: RegisterDto;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            email: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(): Promise<{
        message: string;
        id: string;
        email: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
