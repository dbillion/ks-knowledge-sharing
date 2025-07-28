/**
 * Category and tag-related models for content organization
 */

import { User } from './user.model';

export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

export interface Permission {
  id: string;
  userId?: string;
  roleId?: string;
  level: PermissionLevel;
  grantedBy: User;
  grantedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  usageCount: number;
  createdBy: User;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  parent?: Category;
  parentId?: string;
  children: Category[];
  articleCount: number;
  permissions: Permission[];
  isActive: boolean;
  sortOrder: number;
  path: string; // Full hierarchical path like "technology/frontend/angular"
  level: number; // Depth in the hierarchy (0 = root)
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CategoryTree {
  category: Category;
  children: CategoryTree[];
  hasChildren: boolean;
  isExpanded?: boolean;
}

export interface CategoryStats {
  totalCategories: number;
  totalArticles: number;
  categoriesWithoutArticles: number;
  maxDepth: number;
  averageArticlesPerCategory: number;
}

export interface CategoryPermissionRequest {
  categoryId: string;
  userId?: string;
  roleId?: string;
  level: PermissionLevel;
}

export interface TagSuggestion {
  tag: Tag;
  relevanceScore: number;
  reason: 'popular' | 'similar' | 'recommended';
}