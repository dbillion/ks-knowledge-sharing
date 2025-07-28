/**
 * Version control and change tracking models
 */

import { User } from './user.model';

export enum ChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  RESTORED = 'restored',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished'
}

export enum ChangeScope {
  TITLE = 'title',
  CONTENT = 'content',
  TAGS = 'tags',
  CATEGORY = 'category',
  METADATA = 'metadata',
  ATTACHMENTS = 'attachments'
}

export interface Change {
  id: string;
  type: ChangeType;
  scope: ChangeScope;
  field: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
  lineNumber?: number;
  characterPosition?: number;
}

export interface Version {
  id: string;
  articleId: string;
  versionNumber: number;
  title: string;
  content: string;
  excerpt?: string;
  author: User;
  changeSummary: string;
  changes: Change[];
  isMajorVersion: boolean;
  isCurrentVersion: boolean;
  wordCount: number;
  characterCount: number;
  createdAt: Date;
}

export interface CreateVersionRequest {
  articleId: string;
  title: string;
  content: string;
  excerpt?: string;
  changeSummary: string;
  isMajorVersion?: boolean;
}

export interface VersionComparison {
  fromVersion: Version;
  toVersion: Version;
  differences: VersionDifference[];
  summary: ComparisonSummary;
}

export interface VersionDifference {
  type: 'addition' | 'deletion' | 'modification';
  scope: ChangeScope;
  content: string;
  lineNumber?: number;
  characterPosition?: number;
  context?: string;
}

export interface ComparisonSummary {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
  wordsAdded: number;
  wordsRemoved: number;
  charactersAdded: number;
  charactersRemoved: number;
}

export interface VersionHistory {
  versions: Version[];
  totalVersions: number;
  currentVersion: Version;
  branches?: VersionBranch[];
}

export interface VersionBranch {
  id: string;
  name: string;
  description?: string;
  baseVersionId: string;
  versions: Version[];
  isActive: boolean;
  createdBy: User;
  createdAt: Date;
}

export interface RestoreVersionRequest {
  versionId: string;
  reason?: string;
  createNewVersion: boolean;
}