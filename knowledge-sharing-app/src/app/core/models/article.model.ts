/**
 * Knowledge article models and related interfaces
 */

import { User } from './user.model';
import { Category, Tag } from './category.model';
import { Version } from './version.model';

export enum ArticleStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum ArticleType {
  ARTICLE = 'article',
  FAQ = 'faq',
  TUTORIAL = 'tutorial',
  DOCUMENTATION = 'documentation',
  BEST_PRACTICE = 'best_practice',
  TROUBLESHOOTING = 'troubleshooting'
}

export enum AttachmentType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: AttachmentType;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  articleId: string;
  content: string;
  author: User;
  parentId?: string; // For threaded comments
  replies?: Comment[];
  isResolved: boolean;
  isInternal: boolean; // Internal team comments vs public
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleMetrics {
  viewCount: number;
  uniqueViewCount: number;
  downloadCount: number;
  shareCount: number;
  commentCount: number;
  likeCount: number;
  averageRating: number;
  ratingCount: number;
  lastViewedAt?: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: ArticleType;
  status: ArticleStatus;
  category: Category;
  tags: Tag[];
  author: User;
  contributors: User[];
  version: number;
  versions: Version[];
  attachments: Attachment[];
  comments: Comment[];
  metrics: ArticleMetrics;
  permissions: ArticlePermission[];
  relatedArticles: KnowledgeArticle[];
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  readingTime: number; // Estimated reading time in minutes
  wordCount: number;
  characterCount: number;
  language: string;
  publishedAt?: Date;
  expiresAt?: Date; // For time-sensitive content
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticlePermission {
  id: string;
  userId?: string;
  roleId?: string;
  level: 'read' | 'write' | 'admin';
  grantedBy: User;
  grantedAt: Date;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  type: ArticleType;
  categoryId: string;
  tagIds: string[];
  status?: ArticleStatus;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  language?: string;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  type?: ArticleType;
  categoryId?: string;
  tagIds?: string[];
  status?: ArticleStatus;
  isPublished?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  changeSummary?: string;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tagIds?: string[];
  authorId?: string;
  status?: ArticleStatus;
  type?: ArticleType;
  language?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'viewCount' | 'rating';
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
  isPinned?: boolean;
  hasAttachments?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ArticleAnalytics {
  viewsByDay: { date: string; views: number }[];
  topViewers: { user: User; viewCount: number }[];
  popularSections: { section: string; engagement: number }[];
  searchTerms: { term: string; count: number }[];
  exportStats: { format: string; count: number }[];
  averageReadingTime: number;
  bounceRate: number;
}

export interface DuplicateArticleRequest {
  sourceArticleId: string;
  title: string;
  categoryId?: string;
  includeTags?: boolean;
  includeAttachments?: boolean;
}

export interface ArticleBulkAction {
  articleIds: string[];
  action: 'publish' | 'unpublish' | 'archive' | 'delete' | 'changeCategory' | 'addTags' | 'removeTags';
  parameters?: {
    categoryId?: string;
    tagIds?: string[];
    reason?: string;
  };
}