import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { KnowledgeService, SimpleArticle } from './knowledge.service';
import { CategoryService, SimpleCategory } from './category.service';

export interface SearchFilters {
  categories: string[];
  tags: string[];
  publishedOnly: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchResult {
  articles: SimpleArticle[];
  totalCount: number;
  queryTime: number;
  suggestions: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private knowledgeService: KnowledgeService;
  private categoryService: CategoryService;

  // Search state management with signals
  private searchQuery = signal<string>('');
  private searchFilters = signal<SearchFilters>({
    categories: [],
    tags: [],
    publishedOnly: true
  });
  private searchResults = signal<SearchResult>({
    articles: [],
    totalCount: 0,
    queryTime: 0,
    suggestions: []
  });
  private isSearching = signal<boolean>(false);
  private searchHistory = signal<string[]>([]);
  private savedSearches = signal<SavedSearch[]>([]);

  // Public reactive state
  readonly currentQuery = this.searchQuery.asReadonly();
  readonly currentFilters = this.searchFilters.asReadonly();
  readonly results = this.searchResults.asReadonly();
  readonly loading = this.isSearching.asReadonly();
  readonly history = this.searchHistory.asReadonly();
  readonly saved = this.savedSearches.asReadonly();

  // Computed properties
  readonly hasResults = computed(() => this.searchResults().articles.length > 0);
  readonly hasQuery = computed(() => this.searchQuery().trim().length > 0);
  readonly resultSummary = computed(() => {
    const result = this.searchResults();
    const query = this.searchQuery();
    if (!query) return '';
    
    const count = result.totalCount;
    const time = result.queryTime;
    return `Found ${count} result${count !== 1 ? 's' : ''} for "${query}" (${time}ms)`;
  });

  // RxJS subjects for reactive search
  private querySubject = new BehaviorSubject<string>('');
  private filtersSubject = new BehaviorSubject<SearchFilters>({
    categories: [],
    tags: [],
    publishedOnly: true
  });

  constructor(
    knowledgeService: KnowledgeService,
    categoryService: CategoryService
  ) {
    this.knowledgeService = knowledgeService;
    this.categoryService = categoryService;
    this.setupReactiveSearch();
    this.loadSearchHistory();
    this.loadSavedSearches();
  }

  private setupReactiveSearch(): void {
    // Reactive search with debouncing and filtering
    combineLatest([
      this.querySubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(query => query.trim())
      ),
      this.filtersSubject.pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
    ]).pipe(
      switchMap(([query, filters]) => {
        if (!query) {
          return of({
            articles: [],
            totalCount: 0,
            queryTime: 0,
            suggestions: []
          });
        }

        return this.performSearch(query, filters);
      }),
      catchError(error => {
        console.error('Search error:', error);
        return of({
          articles: [],
          totalCount: 0,
          queryTime: 0,
          suggestions: []
        });
      })
    ).subscribe(result => {
      this.searchResults.set(result);
      this.isSearching.set(false);
    });
  }

  // Public API methods
  search(query: string, filters?: Partial<SearchFilters>): void {
    this.isSearching.set(true);
    this.searchQuery.set(query);
    
    if (filters) {
      this.updateFilters(filters);
    }

    this.querySubject.next(query);
    
    // Add to search history if not empty
    if (query.trim()) {
      this.addToHistory(query.trim());
    }
  }

  updateFilters(filters: Partial<SearchFilters>): void {
    const currentFilters = this.searchFilters();
    const newFilters = { ...currentFilters, ...filters };
    this.searchFilters.set(newFilters);
    this.filtersSubject.next(newFilters);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set({
      articles: [],
      totalCount: 0,
      queryTime: 0,
      suggestions: []
    });
    this.querySubject.next('');
  }

  // Advanced search functionality
  private performSearch(query: string, filters: SearchFilters): Observable<SearchResult> {
    const startTime = performance.now();
    
    return this.knowledgeService.searchArticles(query).pipe(
      map(articles => {
        // Apply filters
        let filteredArticles = articles;

        // Filter by published status
        if (filters.publishedOnly) {
          filteredArticles = filteredArticles.filter(article => article.isPublished);
        }

        // Filter by categories
        if (filters.categories.length > 0) {
          filteredArticles = filteredArticles.filter(article =>
            filters.categories.includes(article.categoryId)
          );
        }

        // Filter by tags
        if (filters.tags.length > 0) {
          filteredArticles = filteredArticles.filter(article =>
            filters.tags.some(tag => article.tags.includes(tag))
          );
        }

        // Generate search suggestions
        const suggestions = this.generateSuggestions(query, articles);
        const endTime = performance.now();
        
        return {
          articles: filteredArticles,
          totalCount: filteredArticles.length,
          queryTime: Math.round(endTime - startTime),
          suggestions
        };
      })
    );
  }

  private generateSuggestions(query: string, articles: SimpleArticle[]): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    articles.forEach(article => {
      // Add tag suggestions
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower) && tag.toLowerCase() !== queryLower) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  // Search history management
  private addToHistory(query: string): void {
    const history = this.searchHistory();
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    this.searchHistory.set(newHistory);
    this.saveSearchHistory();
  }

  private loadSearchHistory(): void {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        this.searchHistory.set(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }

  private saveSearchHistory(): void {
    localStorage.setItem('search_history', JSON.stringify(this.searchHistory()));
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Get popular search terms
  getPopularSearches(): string[] {
    return ['Angular', 'TypeScript', 'Best Practices', 'Testing', 'Performance'];
  }

  // Saved searches management
  saveCurrentSearch(name: string): void {
    const query = this.searchQuery();
    const filters = this.searchFilters();
    
    if (!query.trim()) {
      throw new Error('Cannot save empty search');
    }

    const savedSearch: SavedSearch = {
      id: this.generateId(),
      name: name.trim(),
      query,
      filters: { ...filters },
      createdAt: new Date()
    };

    const current = this.savedSearches();
    const updated = [...current, savedSearch];
    this.savedSearches.set(updated);
    this.saveSavedSearches();
  }

  loadSavedSearch(searchId: string): void {
    const saved = this.savedSearches().find(s => s.id === searchId);
    if (saved) {
      this.search(saved.query, saved.filters);
    }
  }

  deleteSavedSearch(searchId: string): void {
    const current = this.savedSearches();
    const updated = current.filter(s => s.id !== searchId);
    this.savedSearches.set(updated);
    this.saveSavedSearches();
  }

  private loadSavedSearches(): void {
    const saved = localStorage.getItem('saved_searches');
    if (saved) {
      try {
        const searches = JSON.parse(saved);
        if (Array.isArray(searches)) {
          // Convert date strings back to Date objects
          const parsedSearches = searches.map(search => ({
            ...search,
            createdAt: new Date(search.createdAt)
          }));
          this.savedSearches.set(parsedSearches);
        }
      } catch (error) {
        console.error('Failed to load saved searches:', error);
      }
    }
  }

  private saveSavedSearches(): void {
    localStorage.setItem('saved_searches', JSON.stringify(this.savedSearches()));
  }

  // Clear history and saved searches
  clearHistory(): void {
    this.searchHistory.set([]);
    this.saveSearchHistory();
  }

  clearSavedSearches(): void {
    this.savedSearches.set([]);
    this.saveSavedSearches();
  }

  // Export search results
  exportResults(): { query: string; filters: SearchFilters; results: SimpleArticle[] } {
    return {
      query: this.searchQuery(),
      filters: this.searchFilters(),
      results: this.searchResults().articles
    };
  }
}