import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

// Simplified interfaces for mock service
export interface SimpleArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  authorId: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  thumbnailUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  // Mock data for development
  private mockArticles = signal<SimpleArticle[]>([
    {
      id: '1',
      title: 'Getting Started with Angular Signals',
      content: '<p>Angular Signals provide a reactive programming model that improves performance and developer experience. This comprehensive guide covers everything you need to know about implementing signals in your Angular applications.</p><p>Signals are a new reactive primitive that can be used to manage state in Angular applications. They provide a more efficient way to handle reactive updates compared to traditional observables in many scenarios.</p>',
      excerpt: 'Angular Signals provide a reactive programming model that improves performance and developer experience.',
      authorId: 'user1',
      categoryId: 'cat1',
      tags: ['angular', 'signals', 'reactive'],
      isPublished: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      thumbnailUrl: 'https://via.placeholder.com/300x200/4CAF50/white?text=Angular+Signals',
      imageUrl: 'https://via.placeholder.com/800x400/4CAF50/white?text=Angular+Signals+Guide'
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      content: '<p>This article covers TypeScript best practices for enterprise applications, including proper type definitions, code organization, and performance optimization techniques.</p><p>Learn how to write maintainable and scalable TypeScript code that follows industry standards and best practices.</p>',
      excerpt: 'This article covers TypeScript best practices for enterprise applications.',
      authorId: 'user2',
      categoryId: 'cat2',
      tags: ['typescript', 'best-practices', 'development'],
      isPublished: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      thumbnailUrl: 'https://via.placeholder.com/300x200/2196F3/white?text=TypeScript+Tips',
      imageUrl: 'https://via.placeholder.com/800x400/2196F3/white?text=TypeScript+Best+Practices'
    },
    {
      id: '3',
      title: 'Angular Material Design Guidelines',
      content: '<p>Learn how to implement Material Design in your Angular applications with proper component usage, theming, and accessibility considerations.</p><p>This guide provides comprehensive examples and best practices for creating beautiful, accessible user interfaces.</p>',
      excerpt: 'Learn how to implement Material Design in your Angular applications.',
      authorId: 'user1',
      categoryId: 'cat3',
      tags: ['angular', 'material', 'ui'],
      isPublished: false,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      thumbnailUrl: 'https://via.placeholder.com/300x200/FF9800/white?text=Material+Design',
      imageUrl: 'https://via.placeholder.com/800x400/FF9800/white?text=Material+Design+Guide'
    }
  ]);

  // Computed signals for filtered data
  publishedArticles = computed(() => 
    this.mockArticles().filter(article => article.isPublished)
  );

  totalArticles = computed(() => this.mockArticles().length);

  // Get all articles
  getArticles(): Observable<SimpleArticle[]> {
    return of(this.mockArticles()).pipe(delay(500));
  }

  // Get published articles only
  getPublishedArticles(): Observable<SimpleArticle[]> {
    return of(this.publishedArticles()).pipe(delay(500));
  }

  // Get article by ID
  getArticleById(id: string): Observable<SimpleArticle | undefined> {
    const article = this.mockArticles().find(a => a.id === id);
    return of(article).pipe(delay(300));
  }

  // Get articles by category
  getArticlesByCategory(categoryId: string): Observable<SimpleArticle[]> {
    const articles = this.mockArticles().filter(a => a.categoryId === categoryId);
    return of(articles).pipe(delay(400));
  }

  // Get articles by author
  getArticlesByAuthor(authorId: string): Observable<SimpleArticle[]> {
    const articles = this.mockArticles().filter(a => a.authorId === authorId);
    return of(articles).pipe(delay(400));
  }

  // Search articles
  searchArticles(query: string): Observable<SimpleArticle[]> {
    const searchResults = this.mockArticles().filter(article => {
      const searchTerm = query.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm)) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      );
    });
    return of(searchResults).pipe(delay(600));
  }

  // Advanced search with multiple criteria
  advancedSearch(criteria: {
    query?: string;
    categories?: string[];
    tags?: string[];
    authors?: string[];
    publishedOnly?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<SimpleArticle[]> {
    let results = this.mockArticles();
    
    // Filter by query
    if (criteria.query) {
      const searchTerm = criteria.query.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm)) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by categories
    if (criteria.categories && criteria.categories.length > 0) {
      results = results.filter(article => criteria.categories!.includes(article.categoryId));
    }
    
    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(article =>
        criteria.tags!.some(tag => article.tags.includes(tag))
      );
    }
    
    // Filter by authors
    if (criteria.authors && criteria.authors.length > 0) {
      results = results.filter(article => criteria.authors!.includes(article.authorId));
    }
    
    // Filter by published status
    if (criteria.publishedOnly) {
      results = results.filter(article => article.isPublished);
    }
    
    // Filter by date range
    if (criteria.dateFrom) {
      results = results.filter(article => article.createdAt >= criteria.dateFrom!);
    }
    
    if (criteria.dateTo) {
      results = results.filter(article => article.createdAt <= criteria.dateTo!);
    }
    
    return of(results).pipe(delay(400));
  }

  // Get search suggestions based on existing content
  getSearchSuggestions(query: string): Observable<string[]> {
    const suggestions = new Set<string>();
    const searchTerm = query.toLowerCase();
    
    this.mockArticles().forEach(article => {
      // Add matching tags
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm) && tag.toLowerCase() !== searchTerm) {
          suggestions.add(tag);
        }
      });
      
      // Add partial title matches
      const titleWords = article.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.includes(searchTerm) && word !== searchTerm && word.length > 3) {
          suggestions.add(word);
        }
      });
    });
    
    return of(Array.from(suggestions).slice(0, 8)).pipe(delay(200));
  }

  // Create new article
  createArticle(articleData: Omit<SimpleArticle, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>): Observable<SimpleArticle> {
    const newArticle: SimpleArticle = {
      ...articleData,
      id: this.generateId(),
      authorId: 'user1', // Mock current user
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockArticles.update(articles => [...articles, newArticle]);
    return of(newArticle).pipe(delay(800));
  }

  // Update article
  updateArticle(id: string, updates: Partial<SimpleArticle>): Observable<SimpleArticle> {
    this.mockArticles.update(articles => 
      articles.map(article => 
        article.id === id 
          ? { ...article, ...updates, updatedAt: new Date() }
          : article
      )
    );
    
    const updatedArticle = this.mockArticles().find(a => a.id === id);
    return of(updatedArticle!).pipe(delay(700));
  }

  // Delete article
  deleteArticle(id: string): Observable<boolean> {
    this.mockArticles.update(articles => 
      articles.filter(article => article.id !== id)
    );
    return of(true).pipe(delay(500));
  }

  // Publish/unpublish article
  togglePublishStatus(id: string): Observable<SimpleArticle> {
    this.mockArticles.update(articles => 
      articles.map(article => 
        article.id === id 
          ? { ...article, isPublished: !article.isPublished, updatedAt: new Date() }
          : article
      )
    );
    
    const updatedArticle = this.mockArticles().find(a => a.id === id);
    return of(updatedArticle!).pipe(delay(600));
  }

  // Helper method to generate mock IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}