/**
 * Common utility models and interfaces used across the application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ResponseMeta {
  timestamp: Date;
  requestId: string;
  version: string;
  deprecationWarning?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between' | 'greaterThan' | 'lessThan';
  value: any;
  values?: any[]; // For 'in' and 'between' operators
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  ARTICLE_PUBLISHED = 'article_published',
  ARTICLE_UPDATED = 'article_updated',
  ARTICLE_COMMENTED = 'article_commented',
  ARTICLE_LIKED = 'article_liked',
  ARTICLE_SHARED = 'article_shared',
  CATEGORY_CREATED = 'category_created',
  USER_MENTIONED = 'user_mentioned',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_ALERT = 'security_alert'
}

export interface SystemConfig {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: Date;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  uptime: number;
  checks: {
    database: CheckResult;
    search: CheckResult;
    storage: CheckResult;
    cache: CheckResult;
    authentication: CheckResult;
  };
}

export interface CheckResult {
  status: 'pass' | 'fail' | 'warn';
  responseTime?: number;
  details?: string;
  lastChecked: Date;
}
