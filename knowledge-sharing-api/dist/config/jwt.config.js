"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtRefreshConfig = exports.jwtConfig = void 0;
const jwtConfig = () => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
});
exports.jwtConfig = jwtConfig;
exports.jwtRefreshConfig = {
    secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-here',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
//# sourceMappingURL=jwt.config.js.map