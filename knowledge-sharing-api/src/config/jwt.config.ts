import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
});

export const jwtRefreshConfig = {
  secret:
    process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
