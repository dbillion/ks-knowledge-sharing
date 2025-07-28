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
      content: 'Angular Signals provide a reactive programming model that improves performance and developer experience...',
      authorId: 'user1',
      categoryId: 'cat1',
      tags: ['angular', 'signals', 'reactive'],
      isPublished: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      content: 'This article covers TypeScript best practices for enterprise applications...',
      authorId: 'user2',
      categoryId: 'cat2',
      tags: ['typescript', 'best-practices', 'development'],
      isPublished: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '3',
      title: 'Angular Material Design Guidelines',
      content: 'Learn how to implement Material Design in your Angular applications...',
      authorId: 'user1',
      categoryId: 'cat3',
      tags: ['angular', 'material', 'ui'],
      isPublished: false,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
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
    const searchResults = this.mockArticles().filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(searchResults).pipe(delay(600));
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