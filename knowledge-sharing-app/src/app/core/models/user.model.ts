/**
 * User-related models and interfaces for the knowledge sharing application
 */

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum NotificationPreference {
  ALL = 'all',
  MENTIONS = 'mentions',
  NONE = 'none'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationPreference: NotificationPreference;
  articlesPerPage: number;
  defaultEditor: 'rich' | 'markdown';
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}