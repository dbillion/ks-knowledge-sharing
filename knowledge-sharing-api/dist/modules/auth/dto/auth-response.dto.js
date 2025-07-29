"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    username;
    email;
    firstName;
    lastName;
    role;
    avatar;
    isActive;
    emailVerified;
    lastLoginAt;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;
class AuthResponseDto {
    user;
    access_token;
    refresh_token;
    expires_in;
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth-response.dto.js.map