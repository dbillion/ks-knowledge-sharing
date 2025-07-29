import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { KnowledgeService, SimpleArticle } from './knowledge.service';
import { CategoryService, SimpleCategory } from './category.service';

export interface AutocompleteResult {
  type: 'query' | 'article' | 'tag' | 'category' | 'author';
  text: string;
  description?: string;
  icon: string;
  metadata?: {
    id?: string;
    count?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchAutocompleteService {
  private knowledgeService: KnowledgeService;
  private categoryService: CategoryService;
  
  // Cache for performance
  private articlesCache = signal<SimpleArticle[]>([]);
  private categoriesCache = signal<SimpleCategory[]>([]);
  private tagsCache = signal<string[]>([]);
  private authorsCache = signal<string[]>([]);
  
  // Popular search terms
  private popularSearches = signal<string[]>([
    'Angular',
    'TypeScript',
    'Best Practices',
    'Testing',
    'Performance',
    'Components',
    'Services',
    'Routing',
    'Forms',
    'HTTP Client'
  ]);

  constructor(
    knowledgeService: KnowledgeService,
    categoryService: CategoryService
  ) {
    this.knowledgeService = knowledgeService;
    this.categoryService = categoryService;
    this.initializeCache();
  }

  private initializeCache(): void {
    // Load articles and extract data
    this.knowledgeService.getArticles().subscribe(articles => {
      this.articlesCache.set(articles);
      
      // Extract unique tags and authors
      const tags = new Set<string>();
      const authors = new Set<string>();
      
      articles.forEach(article => {
        article.tags.forEach(tag => tags.add(tag));
        authors.add(article.authorId);
      });
      
      this.tagsCache.set(Array.from(tags).sort());
      this.authorsCache.set(Array.from(authors).sort());
    });

    // Load categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categoriesCache.set(categories);
    });
  }

  getSuggestions(query: string, maxResults: number = 8): Observable<AutocompleteResult[]> {
    if (!query || query.length < 2) {
      return of(this.getPopularSuggestions(maxResults));
    }

    const suggestions: AutocompleteResult[] = [];
    const lowerQuery = query.toLowerCase();

    // 1. Exact query suggestions
    suggestions.push({
      type: 'query',
      text: query,
      description: 'Search for this exact term',
      icon: 'search'
    });

    // 2. Article title matches
    const matchingArticles = this.articlesCache()
      .filter(article => 
        article.title.toLowerCase().includes(lowerQuery) && article.isPublished
      )
      .slice(0, 3);

    matchingArticles.forEach(article => {
      suggestions.push({
        type: 'article',
        text: article.title,
        description: `Article by ${article.authorId}`,
        icon: 'article',
        metadata: { id: article.id }
      });
    });

    // 3. Tag matches
    const matchingTags = this.tagsCache()
      .filter(tag => tag.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    matchingTags.forEach(tag => {
      const count = this.getTagUsageCount(tag);
      suggestions.push({
        type: 'tag',
        text: tag,
        description: `Tag (${count} article${count !== 1 ? 's' : ''})`,
        icon: 'label',
        metadata: { count }
      });
    });

    // 4. Category matches
    const matchingCategories = this.categoriesCache()
      .filter(category => 
        category.name.toLowerCase().includes(lowerQuery) && category.isActive
      )
      .slice(0, 2);

    matchingCategories.forEach(category => {
      const count = this.getCategoryArticleCount(category.id);
      suggestions.push({
        type: 'category',
        text: category.name,
        description: `Category (${count} article${count !== 1 ? 's' : ''})`,
        icon: 'folder',
        metadata: { id: category.id, count }
      });
    });

    // 5. Author matches
    const matchingAuthors = this.authorsCache()
      .filter(author => author.toLowerCase().includes(lowerQuery))
      .slice(0, 2);

    matchingAuthors.forEach(author => {
      const count = this.getAuthorArticleCount(author);
      suggestions.push({
        type: 'author',
        text: author,
        description: `Author (${count} article${count !== 1 ? 's' : ''})`,
        icon: 'person',
        metadata: { count }
      });
    });

    // 6. Add popular search variations
    const popularVariations = this.popularSearches()
      .filter(term => 
        term.toLowerCase().includes(lowerQuery) && 
        term.toLowerCase() !== lowerQuery
      )
      .slice(0, 2);

    popularVariations.forEach(term => {
      suggestions.push({
        type: 'query',
        text: term,
        description: 'Popular search term',
        icon: 'trending_up'
      });
    });

    return of(suggestions.slice(0, maxResults));
  }

  getPopularSuggestions(maxResults: number = 5): AutocompleteResult[] {
    return this.popularSearches()
      .slice(0, maxResults)
      .map(term => ({
        type: 'query' as const,
        text: term,
        description: 'Popular search',
        icon: 'trending_up'
      }));
  }

  getRecentSearches(): Observable<AutocompleteResult[]> {
    // Get from localStorage
    const recent = localStorage.getItem('search_history');
    if (!recent) return of([]);

    try {
      const searches = JSON.parse(recent) as string[];
      return of(
        searches.slice(0, 5).map(term => ({
          type: 'query' as const,
          text: term,
          description: 'Recent search',
          icon: 'history'
        }))
      );
    } catch {
      return of([]);
    }
  }

  // Utility methods
  private getTagUsageCount(tag: string): number {
    return this.articlesCache().filter(article => 
      article.tags.includes(tag) && article.isPublished
    ).length;
  }

  private getCategoryArticleCount(categoryId: string): number {
    return this.articlesCache().filter(article => 
      article.categoryId === categoryId && article.isPublished
    ).length;
  }

  private getAuthorArticleCount(authorId: string): number {
    return this.articlesCache().filter(article => 
      article.authorId === authorId && article.isPublished
    ).length;
  }

  // Add to search history
  addToSearchHistory(query: string): void {
    if (!query.trim()) return;

    const recent = localStorage.getItem('search_history');
    let searches: string[] = [];
    
    if (recent) {
      try {
        searches = JSON.parse(recent);
      } catch {
        searches = [];
      }
    }

    // Remove if already exists and add to front
    searches = searches.filter(term => term !== query.trim());
    searches.unshift(query.trim());
    
    // Keep only last 10
    searches = searches.slice(0, 10);
    
    localStorage.setItem('search_history', JSON.stringify(searches));
  }

  // Clear search history
  clearSearchHistory(): void {
    localStorage.removeItem('search_history');
  }

  // Update popular searches based on usage
  updatePopularSearches(query: string): void {
    // In a real app, this would update server-side analytics
    // For now, we'll just add to local popular searches if it's not already there
    const current = this.popularSearches();
    if (!current.includes(query) && query.length > 2) {
      const updated = [query, ...current].slice(0, 10);
      this.popularSearches.set(updated);
    }
  }
}
