/**
 * Search-related models and interfaces
 */

import { KnowledgeArticle, ArticleType, ArticleStatus } from './article.model';
import { Category, Tag } from './category.model';
import { User } from './user.model';

export enum SearchScope {
  ALL = 'all',
  TITLE = 'title',
  CONTENT = 'content',
  TAGS = 'tags',
  AUTHOR = 'author',
  COMMENTS = 'comments'
}

export enum SortOption {
  RELEVANCE = 'relevance',
  DATE_CREATED = 'date_created',
  DATE_UPDATED = 'date_updated',
  TITLE = 'title',
  AUTHOR = 'author',
  VIEW_COUNT = 'view_count',
  RATING = 'rating'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface SearchFilters {
  categories?: string[]; // Category IDs
  tags?: string[]; // Tag IDs
  authors?: string[]; // User IDs
  types?: ArticleType[];
  status?: ArticleStatus[];
  languages?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  hasAttachments?: boolean;
  isFeatured?: boolean;
  minRating?: number;
  minViewCount?: number;
  readingTimeMin?: number;
  readingTimeMax?: number;
}

export interface SearchQuery {
  term: string;
  scope: SearchScope;
  filters: SearchFilters;
  sortBy: SortOption;
  sortOrder: SortOrder;
  page: number;
  limit: number;
  includeHighlight?: boolean;
  fuzzySearch?: boolean;
  exactPhrase?: boolean;
}

export interface SearchHighlight {
  field: string;
  fragments: string[];
}

export interface SearchResultItem {
  article: KnowledgeArticle;
  score: number;
  highlights: SearchHighlight[];
  matchedTerms: string[];
  snippet: string;
}

export interface SearchResult {
  items: SearchResultItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  filters: SearchFilter[];
  suggestions: SearchSuggestion[];
  facets: SearchFacet[];
  searchTime: number; // Time taken in milliseconds
  correctedQuery?: string; // Spell-corrected query if applicable
}

export interface SearchFilter {
  type: 'category' | 'tag' | 'author' | 'type' | 'status' | 'language' | 'date';
  label: string;
  value: string;
  count: number;
  isActive: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related';
  score: number;
}

export interface SearchFacet {
  field: string;
  label: string;
  values: SearchFacetValue[];
}

export interface SearchFacetValue {
  value: string;
  label: string;
  count: number;
  isSelected: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: SearchQuery;
  isPublic: boolean;
  owner: User;
  usageCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSavedSearchRequest {
  name: string;
  description?: string;
  query: SearchQuery;
  isPublic?: boolean;
}

export interface SearchAnalytics {
  totalSearches: number;
  uniqueSearchers: number;
  averageResultsPerSearch: number;
  topSearchTerms: { term: string; count: number; resultCount: number }[];
  noResultQueries: { term: string; count: number }[];
  popularFilters: { filter: string; usage: number }[];
  searchTrends: { date: string; searches: number }[];
  userSearchBehavior: {
    averageQueryLength: number;
    averageSearchDepth: number;
    refinementRate: number;
  };
}

export interface AutocompleteResult {
  suggestions: AutocompleteSuggestion[];
  articles: KnowledgeArticle[];
  categories: Category[];
  tags: Tag[];
  authors: User[];
}

export interface AutocompleteSuggestion {
  text: string;
  type: 'query' | 'article' | 'category' | 'tag' | 'author';
  score: number;
  metadata?: {
    articleId?: string;
    categoryId?: string;
    tagId?: string;
    userId?: string;
  };
}

export interface SearchIndexStatus {
  totalDocuments: number;
  lastIndexedAt: Date;
  isIndexing: boolean;
  indexingProgress?: number;
  pendingUpdates: number;
  errors: SearchIndexError[];
}

export interface SearchIndexError {
  id: string;
  message: string;
  articleId?: string;
  timestamp: Date;
  resolved: boolean;
}

export interface ReindexRequest {
  articleIds?: string[]; // If not provided, reindex all
  force?: boolean; // Force reindex even if up-to-date
  priority?: 'low' | 'normal' | 'high';
}