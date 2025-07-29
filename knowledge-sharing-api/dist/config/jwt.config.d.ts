import { JwtModuleOptions } from '@nestjs/jwt';
export declare const jwtConfig: () => JwtModuleOptions;
export declare const jwtRefreshConfig: {
    secret: string;
    expiresIn: string;
};
